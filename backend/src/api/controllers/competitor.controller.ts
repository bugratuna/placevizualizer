import { Request, Response, NextFunction } from "express";
import * as competitorService from "../../services/competitor.service";
import HttpError from "../../utils/httpError";

export const getCompetitors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { placeId } = req.params;
    const radius = Number(req.query.radius) || 5;

    const data = await competitorService.findCompetitorsByPlaceId(
      placeId,
      radius,
    );

    if (!data) {
      throw new HttpError("Bu place ID için rakip verisi bulunamadı.", 404);
    }

    res.status(200).json({
      success: true,
      data: {
        competitors: data,
      },
    });
  } catch (error) {
    next(error);
  }
};
