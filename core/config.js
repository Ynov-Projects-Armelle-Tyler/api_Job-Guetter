import dotenv from 'dotenv';

if (!process.env.TEST) {
  dotenv.config();
}
