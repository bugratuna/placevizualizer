import MyPlace from "../models/myPlace.model";
import Competitor from "../models/competitor.model";
import { IMyPlace, ICompetitor } from "../types";

export const findCompetitorsByPlaceId = async (
  placeId: string,
  radiusInKm: number,
): Promise<any[] | null> => {
  try {
    const centerPlace: IMyPlace | null = await MyPlace.findOne({ id: placeId });

    if (!centerPlace) {
      console.error(`Merkez mekan bulunamadı: ${placeId}`);
      return null;
    }

    const radiusInMeters = radiusInKm * 1000;

    const competitorsData = await Competitor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [centerPlace.longitude, centerPlace.latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    });

    const formattedCompetitors = competitorsData.map(
      (competitor: ICompetitor) => ({
        pid: competitor.pid,
        name: competitor.name,
        street_address: competitor.street_address,
        city: competitor.city,
        region: competitor.region,
        logo: competitor.logo,
        latitude: competitor.latitude,
        longitude: competitor.longitude,
        sub_category: competitor.sub_category,
        trade_area_activity: competitor.trade_area_activity,
        home_locations_activity: competitor.home_locations_activity,
        distance: competitor.distance,
      }),
    );

    return formattedCompetitors;
  } catch (error) {
    const err = error as Error;
    console.error(`Rakip arama hatası (pid: ${placeId}):`, err);
    throw new Error(
      `Rakip verileri (pid: ${placeId}) aranırken bir hata oluştu: ${err.message}`,
    );
  }
};
