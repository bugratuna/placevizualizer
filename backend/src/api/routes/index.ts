import { Router } from "express";
import tradeAreaRoutes from "./tradeArea.routes";
import homeZipcodeRoutes from "./homeZipcode.routes";
import competitorRoutes from "./competitor.routes";
import zipcodeRoutes from "./zipcode.routes";
import myPlacesRoutes from "./myPlaces.routes";
import customerOriginRoutes from "./customerOrigin.routes";

const router = Router();

router.use(tradeAreaRoutes);
router.use(myPlacesRoutes);
router.use(homeZipcodeRoutes);
router.use(competitorRoutes);
router.use(zipcodeRoutes);
router.use(customerOriginRoutes);

export default router;
