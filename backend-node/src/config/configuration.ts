export default () => ({
    port: parseInt(process.env.PORT || '3001', 10),
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'carbon_emissions',
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
        expiresIn: '24h',
    },
    pythonApi: {
        url: process.env.PYTHON_API_URL || 'http://localhost:8000',
    },
}); 