import { Router } from 'express';
import { getZipcodeById } from '../controllers/zipcode.controller';

const router = Router();

router.get('/zipcodes/:id', getZipcodeById);

export default router;