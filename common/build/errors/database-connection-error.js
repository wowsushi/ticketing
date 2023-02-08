"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const custom_errors_1 = require("./custom-errors");
class DatabaseConnectionError extends custom_errors_1.CustomError {
    constructor() {
        super('db error');
        this.statusCode = 500;
        this.reason = "error conntcting to database";
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
