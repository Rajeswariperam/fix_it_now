import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not set in environment");
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB for migration");

    const Worker = mongoose.model(
      'Worker',
      new mongoose.Schema({}, { strict: false }),
      'workers'
    );

    const res1 = await Worker.updateMany({ jobAccepted: "false" }, { $set: { jobAccepted: false } });
    const res2 = await Worker.updateMany({ jobRejected: "false" }, { $set: { jobRejected: false } });
    const res3 = await Worker.updateMany({ jobAccepted: "true" }, { $set: { jobAccepted: true } });
    const res4 = await Worker.updateMany({ jobRejected: "true" }, { $set: { jobRejected: true } });

    console.log(`jobAccepted "false" -> false matched ${res1.modifiedCount} docs`);
    console.log(`jobRejected "false" -> false matched ${res2.modifiedCount} docs`);
    console.log(`jobAccepted "true" -> true matched ${res3.modifiedCount} docs`);
    console.log(`jobRejected "true" -> true matched ${res4.modifiedCount} docs`);

    // Additionally, ensure missing fields default to boolean false for safety
    const res5 = await Worker.updateMany({ jobAccepted: { $exists: false } }, { $set: { jobAccepted: false } });
    const res6 = await Worker.updateMany({ jobRejected: { $exists: false } }, { $set: { jobRejected: false } });
    console.log(`jobAccepted missing -> set false on ${res5.modifiedCount} docs`);
    console.log(`jobRejected missing -> set false on ${res6.modifiedCount} docs`);

    await mongoose.disconnect();
    console.log("Migration finished and disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

run();
