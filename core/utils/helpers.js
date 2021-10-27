export const omitBy = (obj = {}, cb) => Object
  .entries(obj)
  .filter(([k, v]) => !cb(v, k))
  .reduce((res, [k, v]) => ({ ...res, [k]: v }), {});

export const omit = (obj, keys = []) =>
  omitBy(obj || {}, (value, key) => keys.includes(key));

export const isEmptyString = str => !exists(str) || str === '';

export const random = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

export const isNull = v => v === null;

export const isUndefined = v => typeof v === 'undefined';

export const exists = v => !isNull(v) && !isUndefined(v);

export const isNumber = val => typeof val === 'number';

export const isFinite = val => isNumber(val) && !isNaN(val) && val !== Infinity;
