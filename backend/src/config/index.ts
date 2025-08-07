import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    console.warn("⚠️.env dosyası bulunamadı. Ortam değişkenleri sistemden okunacak.");
}

const config = {
    port: parseInt(process.env.PORT || '5000', 10),
    databaseURL: process.env.MONGODB_URI || '',
    api: {
        prefix: '/api',
    },
};
console.log(config);
if (!config.databaseURL) {
    throw new Error('❌ MONGODB_URI ortam değişkeni tanımlanmamış.');
}

export default config;