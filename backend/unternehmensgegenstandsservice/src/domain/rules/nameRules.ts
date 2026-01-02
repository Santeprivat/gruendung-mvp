// src/domain/rules/nameRules.ts

import {
  ActivitySuggestion,
  CompanyNameAssessment,
  NameSuggestion
} from "../model/domainTypes";

/**
 * Fachliche Bewertung eines Unternehmensnamens
 * (keine rechtliche Verfügbarkeitsprüfung!)
 */
export function assessCompanyName(
  proposedName: string,
  activities: ActivitySuggestion[]
): CompanyNameAssessment {

  const notes: string[] = [];
  const ruleRefs: string[] = [];
  const alternativeNameSuggestions: NameSuggestion[] = [];

  // -------------------------------------------------
  // 1. Grundprüfung: leer / zu kurz
  // -------------------------------------------------

  if (!proposedName || proposedName.trim().length < 3) {
    return {
      result: "NOT_ALLOWED",
      notes: ["Der Unternehmensname ist zu kurz oder leer."],
      availabilityCheckRequired: false,
      ruleRefs: ["NAME_BASIC_001"]
    };
  }

  // -------------------------------------------------
  // 2. Branchenbezug prüfen
  // -------------------------------------------------

  const lowerName = proposedName.toLowerCase();
  const hasITActivity = activities.some(a => a.wzCode.startsWith("62"));

  if (lowerName.includes("software") || lowerName.includes("it")) {
    if (!hasITActivity) {
      notes.push(
        "Der Name enthält einen IT-Bezug, es wurden jedoch keine IT-Tätigkeiten angegeben."
      );
      ruleRefs.push("NAME_DOMAIN_MISMATCH_010");
    }
  }

  // -------------------------------------------------
  // 3. Irreführende Begriffe (vereinfachtes MVP)
  // -------------------------------------------------

  const misleadingTerms = ["institut", "zentrum", "akademie"];
  for (const term of misleadingTerms) {
    if (lowerName.includes(term)) {
      notes.push(
        `Die Bezeichnung "${term}" kann als irreführend angesehen werden.`
      );
      ruleRefs.push("NAME_MISLEADING_TERM_020");
    }
  }

  // -------------------------------------------------
  // 4. Ergebnisstufe bestimmen
  // -------------------------------------------------

  let result: "ALLOWED" | "RISKY" | "NOT_ALLOWED" = "ALLOWED";

  if (notes.length > 0) {
    result = "RISKY";
  }

  // -------------------------------------------------
  // 5. Externe Namensprüfung erforderlich?
  // (für MVP: immer true, wenn Name erlaubt oder riskant)
  // -------------------------------------------------

  const availabilityCheckRequired = true;
  const availabilityCheckReason =
    "Für Unternehmensnamen ist eine rechtliche Verfügbarkeitsprüfung erforderlich.";

  // -------------------------------------------------
  // 6. Alternativnamen vorschlagen (Backup-Namen)
  // -------------------------------------------------

  if (availabilityCheckRequired) {
    alternativeNameSuggestions.push(
      {
        name: `${proposedName} Solutions`,
        justification: "Häufig verwendeter beschreibender Zusatz.",
        variationType: "SUFFIX"
      },
      {
        name: `${proposedName} Services`,
        justification: "Neutraler Zusatz zur Unterscheidung.",
        variationType: "SUFFIX"
      }
    );
  }

  // -------------------------------------------------
  // 7. Ergebnis zurückgeben
  // -------------------------------------------------

  return {
    result,
    notes,
    availabilityCheckRequired,
    availabilityCheckReason,
    alternativeNameSuggestions,
    ruleRefs
  };
}
