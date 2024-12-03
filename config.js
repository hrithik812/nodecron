// config.js

// Use environment variables to store sensitive data securely.
require('dotenv').config();

module.exports = {
  email: {
    user: process.env.EMAIL_USER,       // Your email (stored in .env)
    pass: process.env.EMAIL_PASS,       // Your app password (stored in .env)
    service: 'gmail',
  },
  db: {
    server: process.env.DB_SERVER,     // SQL Server name or IP (stored in .env)
    database: process.env.DB_DATABASE, // Database name (stored in .env)
    port: 1433,
    options: {
      encrypt: true,                   // Use SSL encryption
      trustServerCertificate: true,    // Trust self-signed certificates
      trustedConnection: true      
    }                    
  }
};
