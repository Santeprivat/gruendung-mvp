export type VorgangsEventTyp =
  | "VORGANG_INITIIERT"
  | "VORGANG_STATUS_GEWECHSELT"
  | "DATEN_HINZUGEFUEGT"
  | "DATEN_GEAENDERT";

export interface VorgangsEvent {
  vorgangId: string;
  typ: VorgangsEventTyp;
  payload?: unknown;
  zeitpunkt: string;
}
