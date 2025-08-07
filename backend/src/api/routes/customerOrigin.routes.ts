import { Router } from "express";
import { getCustomerOriginData } from "../controllers/customerOrigin.controller";

const route = Router();

route.get("/:placeId/customer-origin", getCustomerOriginData);

export default route;
