import express from 'express';
import FarmersRequestsController from '../../http/controllers/farmer/requests';

const router = express.Router();

router.post(
  '/generatecollectionrequest',
  FarmersRequestsController.generateCollectionRequest
);
router.get(
  '/generatecollectionrequest',
  FarmersRequestsController.getFarmersCollectionRequestsHistory
);

export default router;
