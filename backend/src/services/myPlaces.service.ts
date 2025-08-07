import MyPlace from '../models/myPlace.model';
import { IMyPlace } from '../types';

/**
 * Tüm "benim mekanlarım" verilerini veritabanından getirir.
 * @returns {Promise<IMyPlace>} Mekan belgelerinin bir dizisi.
 */
export const findAllMyPlaces = async (): Promise<IMyPlace[]> => {
    try {
        const myPlaces = await MyPlace.find({});
        return myPlaces;
    } catch (error) {
        throw new Error(`Mekan verileri alınırken bir hata oluştu: ${(error as Error).message}`);
    }
};

/**
 * Belirtilen ID'ye sahip mekanı veritabanından bulur.
 * @param {string} id - Aranacak mekanın ID'si.
 * @returns {Promise<IMyPlace | null>} Bulunan mekan belgesi veya bulunamazsa null.
 */
export const findMyPlaceById = async (id: string): Promise<IMyPlace | null> => {
    try {
        const myPlace = await MyPlace.findOne({ id: id });
        if(!myPlace){
            return null;
        }
        return myPlace;
    } catch (error) {
        throw new Error(`Mekan (ID: ${id}) aranırken bir hata oluştu: ${(error as Error).message}`);
    }
};