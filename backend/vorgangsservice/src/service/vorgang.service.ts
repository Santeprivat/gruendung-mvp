import { randomUUID } from "crypto";
import { Vorgang } from "../domain/vorgang";
import { vorgaenge, events } from "../repository/vorgang.memory";

export function createVorgang(typ: string): Vorgang {
  const now = new Date().toISOString();

  const vorgang: Vorgang = {
    id: randomUUID(),
    typ,
    status: "INITIIERT",
    daten: {},
    erstelltAm: now,
    geaendertAm: now,
  };

  vorgaenge.set(vorgang.id, vorgang);

  events.push({
    vorgangId: vorgang.id,
    typ: "VORGANG_INITIIERT",
    zeitpunkt: now,
  });

  return vorgang;
}

export function getVorgang(id: string): Vorgang | undefined {
  return vorgaenge.get(id);
}

export function updateStatus(id: string, status: Vorgang["status"]) {
  const vorgang = vorgaenge.get(id);
  if (!vorgang) return;

  vorgang.status = status;
  vorgang.geaendertAm = new Date().toISOString();

  events.push({
    vorgangId: id,
    typ: "VORGANG_STATUS_GEWECHSELT",
    payload: { status },
    zeitpunkt: vorgang.geaendertAm,
  });
}

export function addDaten(id: string, daten: Record<string, unknown>) {
  const vorgang = vorgaenge.get(id);
  if (!vorgang) return;

  vorgang.daten = { ...vorgang.daten, ...daten };
  vorgang.geaendertAm = new Date().toISOString();

  events.push({
    vorgangId: id,
    typ: "DATEN_HINZUGEFUEGT",
    payload: daten,
    zeitpunkt: vorgang.geaendertAm,
  });
}
