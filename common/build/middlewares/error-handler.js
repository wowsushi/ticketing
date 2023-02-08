"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_errors_1 = require("../errors/custom-errors");
const errorHandler = (err, req, res, next) => {
    if (err instanceof custom_errors_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    console.error(err);
    res.status(400).send({
        error: [{ message: "somethingwent wrong" }],
    });
};
exports.errorHandler = errorHandler;
