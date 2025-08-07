import TradeArea from "../models/tradeArea.model";
import { ITradeArea } from "../types";

/**
 * Finds all trade area documents for a specific place ID.
 * @param {string} pid - The place ID to search for.
 * @returns {Promise<ITradeArea[]>} An array of trade area documents.
 */
export const findTradeAreasByPlaceId = async (
  pid: string,
): Promise<ITradeArea[]> => {
  try {
    return await TradeArea.find({ pid: pid });
  } catch (error) {
    throw new Error(
      `Ticaret alanı verileri (pid: ${pid}) alınırken bir hata oluştu: ${(error as Error).message}`,
    );
  }
};
