import dotenv from 'dotenv';

dotenv.config();

// TODO: check env variables existence

export const env = process.env.NODE_ENV;
export const port = Number(process.env.PORT);
export const gPort = Number(process.env.GPORT);
export const keys = [process.env.KEY1, process.env.KEY2, process.env.KEY3];
export const isDev = env === 'development';
export const connectionString = process.env.CONNECTION_STRING;
