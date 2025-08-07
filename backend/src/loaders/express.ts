import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config/index';
import routes from '../api/routes/index';
import errorHandler from '../middlewares/errorHandler';

export default ({ app }: { app: Application }): void => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));

    app.use(config.api.prefix, routes);

    app.use(errorHandler);
};