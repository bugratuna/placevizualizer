import Zipcode from '../models/zipcode.model';
import { IZipcode } from '../types';

export const findZipcodeById = async (id: string): Promise<IZipcode | null> => {
    try {
        const zipcode = await Zipcode.findOne({ id: id });
        if(!zipcode){
            return null;
        }
        return zipcode;
    } catch (error) {
        throw new Error(`Zipcode (ID: ${id}) aranırken bir hata oluştu: ${(error as Error).message}`);
    }
};