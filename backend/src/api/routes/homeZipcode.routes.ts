import { Router } from "express";
import { getHomeZipcodes } from "../controllers/homeZipcode.controller";

const router = Router();

router.get("/places/:placeId/home-zipcodes", getHomeZipcodes);

export default router;
