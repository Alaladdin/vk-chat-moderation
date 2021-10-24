require('dotenv').config();

const isProd = process.env.NODE_ENV !== 'production';

module.exports = {
  token: isProd ? process.env.TOKEN : process.env.TOKEN_DEV,
};
