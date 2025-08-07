import mongoose from "mongoose";
import Competitor from "../models/competitor.model";
import config from "../config";

const migrateCompetitors = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(config.databaseURL);
    console.log("MongoDB connected successfully.");

    console.log("Starting competitor data migration...");

    const competitorsToMigrate = await Competitor.find({
      location: { $exists: false },
    });

    if (competitorsToMigrate.length === 0) {
      console.log(
        "All competitor documents already have the location field. No migration needed.",
      );
      return;
    }

    console.log(`Found ${competitorsToMigrate.length} documents to migrate.`);

    let successCount = 0;
    for (const competitor of competitorsToMigrate) {
      try {
        competitor.location = {
          type: "Point",
          coordinates: [competitor.longitude, competitor.latitude],
        };

      if (!competitor.sub_category || competitor.sub_category.trim() === "") {
          console.log(
            `Found competitor with empty sub_category: ${competitor.name}. Assigning 'Uncategorized'.`,
          );
          competitor.sub_category = "Uncategorized";
        }

        await competitor.save();
        successCount++;
      } catch (validationError) {
        console.error(
          `Could not migrate competitor with pid: ${competitor.pid}. Error:`,
          validationError,
        );
      }
    }

    console.log(
      `Successfully migrated ${successCount} out of ${competitorsToMigrate.length} documents.`,
    );
  } catch (error) {
    console.error("An error occurred during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

migrateCompetitors();
