import { Router } from 'express';
import { getMyPlaces, getMyPlaceById } from '../controllers/myPlaces.controller';

const router = Router();

router.get('/my-places', getMyPlaces);
router.get('/my-places/:id', getMyPlaceById);

export default router;