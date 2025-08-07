import { Request, Response, NextFunction } from "express";
import { findTradeAreasByPlaceId } from "../../services/tradeArea.service";
import { findHomeZipcodesByPlaceId } from "../../services/homeZipcode.service";
import HttpError from "../../utils/httpError";
import { ITradeArea, IHomeZipcode } from "../../types";
import { DATA_TYPES, ERROR_MESSAGES, HTTP_STATUS } from "../../constants";

export const getCustomerOriginData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { placeId } = req.params;
    const { dataType, percentiles } = req.query;

    if (!placeId || !dataType) {
      throw new HttpError(
        ERROR_MESSAGES.INVALID_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (dataType === DATA_TYPES.TRADE_AREA) {
      const percentileArray = percentiles
        ? (percentiles as string).split(",").map((p) => parseInt(p, 10))
        : [30, 50, 70];

      const tradeAreas: ITradeArea[] = await findTradeAreasByPlaceId(
        placeId as string,
      );

      if (!tradeAreas || tradeAreas.length === 0) {
        throw new HttpError(
          ERROR_MESSAGES.DATA_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      const filteredTradeAreas = tradeAreas.filter((ta) =>
        percentileArray.includes(ta.trade_area),
      );

      return res.status(200).json(filteredTradeAreas);
    } else if (dataType === DATA_TYPES.HOME_ZIPCODES) {
      const homeZipcodes: IHomeZipcode | null = await findHomeZipcodesByPlaceId(
        placeId as string,
      );

      if (!homeZipcodes) {
        throw new HttpError(
          ERROR_MESSAGES.DATA_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      return res.status(200).json(homeZipcodes);
    } else {
      throw new HttpError(
        ERROR_MESSAGES.INVALID_DATA_TYPE,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  } catch (error) {
    next(error);
  }
};
