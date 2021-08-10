import express from 'express';
import RetailerController from '../../http/controllers/retailer/profile';

const router = express.Router();

router.post('/', RetailerController.createRetailer);
router.post('/businessprojections', RetailerController.addProjections);

export default router;
