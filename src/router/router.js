import express from 'express';
import path from 'path';
import authRoutes from './auth/auth';
import farmersProfile from './farmer/profile';
import farmersRequests from './farmer/requests';
import retailersProfile from './retailer/profile';
import { requireAuth } from '../middleware/passport';

export default function (app) {
  const homeRoutes = express.Router();
  const apiRoutes = express.Router();

  // API General Route
  homeRoutes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/index.html'));
  });

  // protected route
  apiRoutes.get('/protected', requireAuth, (req, res) => {
    res.send({ content: 'The protected test route is functional!' });
  });

  // api Routes
  apiRoutes.use('/auth', authRoutes);
  apiRoutes.use(
    '/accounts/farmer',
    requireAuth,
    farmersProfile,
    farmersRequests
  );
  apiRoutes.use('/accounts/retailer', requireAuth, retailersProfile);

  // Set url for API group routes
  app.use('/api', apiRoutes);
  app.use('/', homeRoutes);
}
