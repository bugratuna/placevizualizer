import { Request, Response, NextFunction } from "express";
import * as homeZipcodeService from "../../services/homeZipcode.service";
import HttpError from "../../utils/httpError";

export const getHomeZipcodes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { placeId } = req.params;
    const data = await homeZipcodeService.findHomeZipcodesByPlaceId(placeId);

    if (!data) {
      throw new HttpError(
        "Bu place ID için home zipcode verisi bulunamadı.",
        404,
      );
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
