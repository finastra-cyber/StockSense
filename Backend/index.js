import express from "express";
import dotenv from "dotenv";
import DBconnect2 from "./src/config/DBconnect2.js";
import AuthRoute from "./src/routes/AuthRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", AuthRoute);

app.listen(PORT, async () => {
  console.log(`Server Listening on Port ${PORT}`);
  await DBconnect2();
});
