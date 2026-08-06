import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

async function DBconnect() {
  try {
    await mongoose
      .connect(MONGO_URL, { dbName: "FinAstra" })
      .then(() => console.log("DataBase Connected Successfully!"));
  } catch (e) {
    console.log("DB Connection Error: " + e.message);
  }
}

export default DBconnect;
