import { Request, Response, NextFunction } from "express";
import * as tradeAreaService from "../../services/tradeArea.service";

export const getTradeAreas = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { placeId } = req.params;
    const data = await tradeAreaService.findTradeAreasByPlaceId(placeId);

    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
