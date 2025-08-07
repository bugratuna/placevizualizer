import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface HttpError extends Error {
    statusCode?: number;
}

const errorHandler: ErrorRequestHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucuda beklenmedik bir hata oluştu.';

    res.status(statusCode).json({
        success: false,
        status: 'error',
        statusCode: statusCode,
        message: message,
    });
};

export default errorHandler;