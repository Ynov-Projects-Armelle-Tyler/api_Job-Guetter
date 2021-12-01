import { v4 as uuid } from 'uuid';

export const generateId = () =>
  uuid();

export const generateEmail = () =>
  `${generateId()}@job-guetter-test.fr`;
