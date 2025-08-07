import express from 'express';
import config from './config/index';
import loaders from './loaders/index';

async function startServer(): Promise<void> {
    const app = express();

    await loaders({ expressApp: app });

    app.listen(config.port, () => {
        console.log(`
      ################################################
      🛡️  Sunucu, ${config.port} portunda çalışıyor. 🛡️
      ################################################
    `);
    }).on('error', (err: Error) => {
        console.error(`❌ Sunucu başlatılamadı: ${err.message}`);
        process.exit(1);
    });
}

startServer();