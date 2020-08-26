require('dotenv').config();

module.exports = {
    server: {
        host: '127.0.0.1',
        port: '3333'
    },
    db: {
        host: process.env.DB_HOST,
        db: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        securitykey: process.env.SECURITY_KEY
    }
}