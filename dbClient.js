const { Client } = require('pg');
const config = require('./config.json');

const dbClient = new Client({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
});

dbClient.connect()
	.then(() => console.log('Connected to database'))
	.catch(err => console.error('Database connection error:', err));

module.exports = dbClient;