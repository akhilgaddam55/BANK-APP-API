'use strict';

require('dotenv').config();

export const development = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  frontendUrl: process.env.FRONTEND_URL,
  dialect: 'postgres',
  port: 5432,
  define: {
    timestamps: true,
  },
  models: [__dirname + '/../src/database/models'],
  migrations: [__dirname + '/../src/database/migrations'],
  seeders: [__dirname + '/../src/database/seeders'],
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  frontendUrl: process.env.FRONTEND_URL,
};
export const test = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'postgres', // Set the dialect to 'postgres'
  define: {
    timestamps: true,
  },
  models: [__dirname + '/../src/database/models'],
  migrations: [__dirname + '/../src/database/migrations'],
  seeders: [__dirname + '/../src/database/seeders'],
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  frontendUrl: process.env.FRONTEND_URL,
};
export const production = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'postgres', // Set the dialect to 'postgres'
  define: {
    timestamps: true,
  },
  models: [__dirname + '/../src/database/models'],
  migrations: [__dirname + '/../src/database/migrations'],
  seeders: [__dirname + '/../src/database/seeders'],
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  frontendUrl: process.env.FRONTEND_URL,
};
