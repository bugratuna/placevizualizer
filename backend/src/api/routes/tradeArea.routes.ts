import { Router } from "express";
import { getTradeAreas } from "../controllers/tradeArea.controller";

const router = Router();

router.get("/places/:placeId/trade-areas", getTradeAreas);

export default router;
