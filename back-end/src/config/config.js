import dotenv from 'dotenv';
dotenv.config();

const config = {
    app: {
        port: process.env.PORT  
    }, 
    jwt: {
        secret: process.env.JET_SECRET 
    },
    mysql: {
        host: process.env.MYSQL_HOST, 
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD, 
        database: process.env.MYSQL_DATABASE 
    }
};

export default config;