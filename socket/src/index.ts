import morgan from 'morgan'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'

import { createServer } from 'http'
import { Server } from 'socket.io'

import socket from './socket'

import configs from './configs'

import authMiddleware from './middlewares'

const app = express()

const conf = configs.createConfigs()

console.log({ conf })

const logger = configs.createLogger(__dirname)

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: conf.CORS_ORIGIN,
    credentials: true,
  },
})

app.use(bodyParser.json())
app.use(authMiddleware)
app.use(morgan('combined', { stream: logger }))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(conf.PORT, () => {
  console.log(`Server is running on port ${conf.PORT}`)
})

httpServer.listen(conf.PORT, conf.HOST, () => {
  console.info(`SocketServer is listening: http://${conf.HOST}:${conf.PORT}`)
  socket({ io })
})
