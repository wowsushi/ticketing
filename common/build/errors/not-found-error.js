"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const custom_errors_1 = require("./custom-errors");
class NotFoundError extends custom_errors_1.CustomError {
    constructor(error) {
        super('Invalid request parameters');
        this.error = error;
        this.statusCode = 404;
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not Found Page' }];
    }
}
exports.NotFoundError = NotFoundError;
