// prisma.config.js
require('dotenv').config();

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://...", 
  },
  migrations: {
    seed: 'node prisma/seed.ts',
  },
};