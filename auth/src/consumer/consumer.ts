import amqp, { Message } from 'amqplib/callback_api'

import { ConfigType } from '../configs'
import { IUserService } from '../services'

const createMQConsumer = (config: ConfigType, userService: IUserService) => {
  console.log('Consumer connecting to RabbitMQ...')
  return () => {
    amqp.connect(config.AMQP_URL, (errConn, conn) => {
      if (errConn) {
        throw errConn
      }

      conn.createChannel((errChan, chan) => {
        if (errChan) {
          throw errChan
        }

        console.log('Consumer connected to RabbitMQ')
        chan.assertQueue(config.USER_TO_AUTH_QUEUE, { durable: true })
        chan.consume(config.USER_TO_AUTH_QUEUE, (msg: Message | null) => {
          if (msg) {
            const parsed = JSON.parse(msg.content.toString())
            switch (parsed.action) {
              case 'CREATE':
                userService.createFromUser(parsed.data)
                break
              case 'UPDATE':
                userService.update(parsed.data)
                break
              case 'DELETE':
                userService.delete(parsed.data.id)
                break
              default:
                break
            }
          }
        }, { noAck: true })
      })
    })
  }
}

export default createMQConsumer
