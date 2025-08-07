import { Request, Response, NextFunction } from "express";
import * as myPlaceService from "../../services/myPlaces.service";
import HttpError from "../../utils/httpError";

export const getMyPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await myPlaceService.findAllMyPlaces();
    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPlaceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await myPlaceService.findMyPlaceById(id);

    if (!data) {
      throw new HttpError("Bu ID ile bir mekan bulunamadı.", 404);
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
