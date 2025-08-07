import { Request, Response, NextFunction } from "express";
import * as zipcodeService from "../../services/zipcode.service";
import HttpError from "../../utils/httpError";

export const getZipcodeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await zipcodeService.findZipcodeById(id);

    if (!data) {
      throw new HttpError("Bu ID ile bir posta kodu bulunamadı.", 404);
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
