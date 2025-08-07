import mongoose from 'mongoose';
import config from '../config/index';

export default async (): Promise<void> => {
    try {
        await mongoose.connect(config.databaseURL);
        console.log('✅ MongoDB connected successfully.');
    } catch (err) {
        console.error('❌ MongoDB connection error:', (err as Error).message);
        process.exit(1);
    }

    mongoose.connection.on('error', (err: Error) => {
        console.error(`MongoDB runtime error: ${err}`);
    });
};