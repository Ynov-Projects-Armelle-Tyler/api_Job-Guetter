import { BadRequest } from './errors';

export const assert = (value, error = BadRequest(), condition) => {
  if (
    (
      typeof condition === 'undefined' &&
      (
        value === null ||
        typeof value === 'undefined' ||
        (typeof value === 'string' && value === '')
      )
    ) ||
    condition === false ||
    (typeof condition === 'function' && !condition(value))
  ) {
    throw error;
  }

  return value;
};
