import express from "express";
import { router as vorgaengeRouter } from "./routes/vorgaenge.routes";
import cors from "cors";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", vorgaengeRouter);
