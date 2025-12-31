import { Router } from "express";
import {
  createVorgang,
  getVorgang,
  updateStatus,
  addDaten,
} from "../service/vorgang.service";

export const router = Router();

router.post("/vorgaenge", (req, res) => {
  const { typ } = req.body;
  const vorgang = createVorgang(typ);
  res.status(201).json(vorgang);
});

router.get("/vorgaenge/:id", (req, res) => {
  const vorgang = getVorgang(req.params.id);
  if (!vorgang) return res.sendStatus(404);
  res.json(vorgang);
});

router.patch("/vorgaenge/:id/status", (req, res) => {
  updateStatus(req.params.id, req.body.status);
  res.sendStatus(204);
});

router.patch("/vorgaenge/:id/daten", (req, res) => {
  addDaten(req.params.id, req.body);
  res.sendStatus(204);
});
