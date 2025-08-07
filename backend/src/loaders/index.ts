import express, { Application } from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';

export default async ({ expressApp }: { expressApp: Application }): Promise<void> => {
    await mongooseLoader();
    console.log('MongoDB Yüklendi');

    expressLoader({ app: expressApp });
    console.log('Express Yüklendi');
};