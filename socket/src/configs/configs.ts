import dotenv from 'dotenv'

dotenv.config()

export type ConfigType = {
  PORT: number;
  HOST: string;
  CORS_ORIGIN: string[];
  DB_HOST: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  SECRET_KEY: string;
  AMQP_URL: string;
  AUTH_TO_USER_QUEUE: string;
  USER_TO_AUTH_QUEUE: string;
  USER_TO_CHAT_QUEUE: string;
}

function createConfigs(): ConfigType {
  return {
    HOST: 'localhost',
    PORT: parseInt(String(process.env.PORT), 10),
    CORS_ORIGIN: ['http://localhost:3000'],
    DB_HOST: String(process.env.DB_HOST),
    DB_USERNAME: String(process.env.DB_USERNAME),
    DB_NAME: String(process.env.DB_NAME),
    DB_PASSWORD: String(process.env.DB_PASSWORD),
    SECRET_KEY: String(process.env.SECRET_KEY),
    AMQP_URL: String(process.env.AMQP_URL),
    AUTH_TO_USER_QUEUE: String(process.env.AUTH_TO_USER_QUEUE),
    USER_TO_AUTH_QUEUE: String(process.env.USER_TO_AUTH_QUEUE),
    USER_TO_CHAT_QUEUE: String(process.env.USER_TO_CHAT_QUEUE),
  }
}

export default createConfigs
