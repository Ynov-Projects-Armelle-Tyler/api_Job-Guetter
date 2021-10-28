import { number, boolean } from './parse';

const env = process.env;

// General
export const PORT = number(env.PORT) || 8000;
export const COOKIE_NAME = env.COOKIE_NAME || '_job_guetter';
export const DOMAIN = env.DOMAIN;
export const TEST = boolean(process.env.TEST || false);

// Signature
export const TOKEN_KEY = env.TOKEN_KEY;
export const REFRESH_TOKEN_KEY = env.REFRESH_TOKEN_KEY;
export const TOKEN_NORMAL_EXPIRY = env.TOKEN_NORMAL_EXPIRY;
export const TOKEN_EXTENDED_EXPIRY = env.TOKEN_EXTENDED_EXPIRY;

// Databases
export const MONGODB_URI = env.MONGODB_URI;

// Sendgrid
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
