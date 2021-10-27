import { number, boolean } from './parse';

const env = process.env;

// General
export const PORT = number(env.PORT) || 8000;
export const COOKIE_NAME = env.COOKIE_NAME || '_job_guetter';
export const DOMAIN = env.DOMAIN;
export const TEST = boolean(process.env.TEST || false);

// Databases
export const MONGODB_URI = env.MONGODB_URI;
