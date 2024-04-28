const dotenv = require('dotenv');
const cors = require('cors');

// Configurar dotenv
dotenv.config();

// Configurar CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = {
  cors: cors(corsOptions),
};
