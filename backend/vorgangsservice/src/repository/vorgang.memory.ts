import type { Vorgang } from "../domain/vorgang";
import type { VorgangsEvent } from "../domain/vorgang.events";

export const vorgaenge = new Map<string, Vorgang>();
export const events: VorgangsEvent[] = [];

// --------------------------------------------------
// TESTDATEN – nur für lokalen Stub / MVP
// --------------------------------------------------

const now = new Date().toISOString();

vorgaenge.set("123", {
  id: "123",
  typ: "GRUENDUNG",
  status: "INITIIERT",
  daten: {
    rechtsform: "GmbH",
    firma: "Muster GmbH",
    sitz: "Berlin"
  },
  erstelltAm: now,
  geaendertAm: now
});
    