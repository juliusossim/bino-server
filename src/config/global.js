'use strict';
import fs from 'fs';
import path from 'path';
require('dotenv').config();

const pathToPubKey = path.join(__dirname, '/crypto/', 'id_rsa_pub.pem');
const pathToPrivKey = path.join(__dirname, '/crypto/', 'id_rsa_priv.pem');

const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');

const baseUrl = process.env.BASE_URL;

global.config = {
  common: {
    env: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME,
    companyName: 'bincom',
    companyAddress: 'Lagos',
    companyLocation: 'Lagos',
    baseUrl: baseUrl,
    apiUrl: process.env.API_URL,
    clientUrl: process.env.CLIENT_URL,
    genders: { male: 'M', female: 'F' },
    userGroups: { admin: 1, client: 2 },
    userTitles: [
      'Mr.',
      'Mrs.',
      'Miss',
      'Mz.',
      'Dr.',
      'Barr.',
      'Engr.',
      'Lt.',
      'Capt.',
      'Chief',
      'Rev.',
      'Pst.',
      'Apst.',
    ],
    APP_PUB_KEY: PUB_KEY,
    APP_PRIV_KEY: PRIV_KEY,
    logo: {
      main: baseUrl + '/static/images/logo/sendiv.png',
      email: baseUrl + '/static/images/logo/email.png',
    },
  },
  development: {
    mail: {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      username: process.env.MAILTRAP_USERNAME,
      password: process.env.MAILTRAP_PASS,
      sender: process.env.MAILTRAP_SENDER,
    },
  },
};

export default global.config;
