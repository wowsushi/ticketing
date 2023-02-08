import { CustomError } from './custom-errors';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public error: string) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found Page' }];
  }
}
