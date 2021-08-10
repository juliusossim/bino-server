import express from 'express';
import FarmersController from '../../http/controllers/farmer/profile';

const router = express.Router();

router.post('/farms', FarmersController.createFarmerAccount);
router.post('/farmdetails', FarmersController.addFarmProjection);
router.post('/bankinfo', FarmersController.addBankInformation);

export default router;
