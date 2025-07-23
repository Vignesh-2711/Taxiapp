import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import routes from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

createConnection().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});