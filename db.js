const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
  user: 'postgres',      // Replace with your PostgreSQL username
  host: 'localhost',          // Replace with your host (use 'localhost' for local setup)
  database: 'crud_app',       // Replace with your PostgreSQL database name
  password: '1234567890',  // Replace with your PostgreSQL password
  port: 5432,                 // Default PostgreSQL port is 5432
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Connection error', err.stack));
