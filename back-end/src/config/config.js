import dotenv from 'dotenv';
dotenv.config();

const config = {
    app: {
        port: process.env.PORT || 8000
    }, 
    jwt: {
        secret: process.env.JET_SECRET || 'your_jwt_secret'
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'bdh'
    }
};

export default config;