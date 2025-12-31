export type Vorgangsstatus =
  | "INITIIERT"
  | "IN_BEARBEITUNG"
  | "ABGESCHLOSSEN";

export interface Vorgang {
  id: string;
  typ: string;
  status: Vorgangsstatus;
  daten: Record<string, unknown>;
  erstelltAm: string;
  geaendertAm: string;
}
