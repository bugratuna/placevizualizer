import HomeZipcode from "../models/homeZipcode.model";
import { IHomeZipcode } from "../types";

export const findHomeZipcodesByPlaceId = async (
  placeId: string,
): Promise<IHomeZipcode | null> => {
  try {
    const homeZipcodes = await HomeZipcode.findOne({ pid: placeId });
    if (!homeZipcodes) {
      return null;
    }
    return homeZipcodes;
  } catch (error) {
    throw new Error(
      `Home zipcodes (pid: ${placeId}) aranırken bir hata oluştu: ${(error as Error).message}`,
    );
  }
};
