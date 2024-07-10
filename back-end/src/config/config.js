import dotenv from 'dotenv';
dotenv.config();

export const config = {
    app: {
        port: process.env.PORT || 8000
    }, 
    
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'bdh'
    }
};