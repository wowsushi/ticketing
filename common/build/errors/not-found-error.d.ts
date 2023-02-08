import { CustomError } from './custom-errors';
export declare class NotFoundError extends CustomError {
    error: string;
    statusCode: number;
    constructor(error: string);
    serializeErrors(): {
        message: string;
    }[];
}
