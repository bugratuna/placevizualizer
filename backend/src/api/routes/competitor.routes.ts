import { Router } from 'express';
import { getCompetitors } from '../controllers/competitor.controller';

const router = Router();

router.get('/places/:placeId/competitors', getCompetitors);

export default router;