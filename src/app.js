/**
 * ===============================================================
 * File: app.js
 * This file bootstraps all needed modules, plugins and setups
 * needed for smooth running of the application
 * ===============================================================
 */
import logger from 'morgan'; // For logging functionalities
import express from 'express'; // REST API
import cookieParser from 'cookie-parser'; // Cookie management
import path from 'path'; // Path parser
import cors from 'cors'; // CORS configurator
import session from 'express-session'; // REST API session manager
import {
  databaseConfig,
  productionClient,
  testClient,
} from './Helpers/settings'; // All user-defined environment configurations
import router from './Router/router'; // Application routes

//global config
import './config/global.js';

const app = express();
const corsOptions = {
  origin: process.env.TEST_CLIENT,
};

// Get Common configurations
const params = { jwtSecret : process.env.JWT_SECRET };

if (process.env.NODE_ENV === 'production') {
  params.client = productionClient;
} else {
  params.client = testClient;
}

app.use(logger('dev')); // Enable Logging
//app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
//app.use(bodyParser.json()); // Send JSON responses

app.use(cors(corsOptions)); // Enable CORS from client-side
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Enable Cookie parser
app.use(express.static(path.join(__dirname, '../public'))); // Enable assets from public folder

//views
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// Get MySQL config options, init sessions and pass to store
const databaseOptions = databaseConfig;
const MySQlStore = require('express-mysql-session')(session);
const sessionStore = new MySQlStore(databaseOptions);

// Database Setup, this must be successful for every other thing to run
// session store Setup
const sessionParameters = session({
  secret: params.jwtSecret,
  saveUninitialized: false,
  resave: false,
  store: sessionStore,
  cookie: { path: '/', secure: true },
});

app.use(sessionParameters);
// Import routes to be served
router(app);

export default app;
