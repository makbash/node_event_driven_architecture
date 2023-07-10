import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'

import configs from './configs'
import createUserService from './services'
import createAuthRouter from './routes'
import createMQConsumer from './consumer'
import createMQPublisher from './publisher'
import createUserRepository from './repositories'
import AppError from './utils/appError'

const app = express()

const conf = configs.createConfigs()

console.log({ conf })

const corsOptions: cors.CorsOptions = {
  origin: conf.WHITE_LIST,
  credentials: true,
}

const conn = configs.createMongoDB(conf)
const logger = configs.createLogger(__dirname)
const userRepo = createUserRepository(conn)
const publisher = createMQPublisher(conf)
const userService = createUserService(userRepo, publisher)
const consumer = createMQConsumer(conf, userService)
const authRouter = createAuthRouter(userService)

app.use(bodyParser.json())

app.use(cors(corsOptions))

app.use(morgan('combined', { stream: logger }))
app.use('/auth', authRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

// HEALTH CHECKER
app.get('/health', async (_, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Hi!',
  })
})

// UNHANDLED ROUTE
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`))
})

// GLOBAL ERROR HANDLER
app.use(
  (error: AppError, req: Request, res: Response) => {
    error.status = error.status || 'error'
    error.statusCode = error.statusCode || 500

    if (error.status === 'error') {
      console.error(error)
    }

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    })
  },
)

consumer()

app.listen(conf.PORT, () => {
  console.log(`Server is running on port ${conf.PORT}`)
})
