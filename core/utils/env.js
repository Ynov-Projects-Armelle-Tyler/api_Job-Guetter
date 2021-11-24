import { number, boolean } from './parse';

const env = process.env;

// General
export const PORT = number(env.PORT) || 8000;
export const COOKIE_NAME = env.COOKIE_NAME || '_job_guetter';
export const DOMAIN = env.DOMAIN;
export const TEST = boolean(process.env.TEST || false);
export const MAX_REQUEST_RETRIES = number(env.MAX_REQUEST_RETRIES) || 5;

// Signature
export const TOKEN_KEY = env.TOKEN_KEY;
export const REFRESH_TOKEN_KEY = env.REFRESH_TOKEN_KEY;
export const TOKEN_NORMAL_EXPIRY = env.TOKEN_NORMAL_EXPIRY;
export const TOKEN_EXTENDED_EXPIRY = env.TOKEN_EXTENDED_EXPIRY;

// Databases
export const MONGODB_URI = env.MONGODB_URI;
export const REDIS_URL = env.REDIS_URL;
export const REDIS_PORT = env.REDIS_PORT;

// Sendgrid
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
export const EMAIL_SENDER = JSON.parse(env.EMAIL_SENDER);

// Sirene
export const SIRENE_URI = env.SIRENE_URI;
