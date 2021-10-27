class AppError extends Error {

  constructor (
    name = 'ServerError',
    type = 500,
    message = 'unknown',
    description = undefined,
    additionalProps = {}
  ) {
    super(`[${type} ${name || 'Error'}] error -> ${message || 'unknown'}`);
    this.name = name;
    this.type = type;
    this.message = message;
    this.description = description;
    this.additionalProps = additionalProps;
  }

  toJSON () {
    return {
      error: this.name,
      type: this.type,
      reason: this.message,
      description: this.description,
      ...this.additionalProps,
    };
  }

  send (res) {
    res.status(this.type).json({
      error: this.message,
      description: this.description,
      ...this.additionalProps,
    });
  }
}

export const BadRequest = (name = 'bad_request', ...args) =>
  new AppError('BadRequest', 400, name, ...args);

export const Unauthorized = (name = 'unauthorized', ...args) =>
  new AppError('Unauthorized', 401, name, ...args);

export const PaymentRequired = (name = 'payment_required', ...args) =>
  new AppError('PaymentRequired', 402, name, ...args);

export const Forbidden = (name = 'forbidden', ...args) =>
  new AppError('Forbidden', 403, name, ...args);

export const NotFound = (name = 'not_found', ...args) =>
  new AppError('NotFound', 404, name, ...args);

export const TooManyRequests = (name = 'too_many_requests', ...args) =>
  new AppError('TooManyRequests', 429, name, ...args);

export const ServerError = (...args) =>
  new AppError('ServerError', 500, ...args);

export const catchError = cb =>
  async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (e) {
      next(e);
    }
  }
;
