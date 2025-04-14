// lib/redis.js
const Redis = require('ioredis');
require('dotenv').config()
const redis = new Redis(
  process.env.RADIS_URL
);

module.exports = {redis};
