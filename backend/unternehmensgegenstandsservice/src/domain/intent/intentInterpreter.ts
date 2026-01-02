// src/domain/intent/intentInterpreter.ts

import {
  Intent,
  ResolvedFact,
  ActivitySuggestion
} from "../model/domainTypes";

/**
 * Interpretiert eine Gründungsabsicht (Freitext) und leitet
 * fachliche Tätigkeitsvorschläge ab.
 *
 * Diese Funktion ist bewusst heuristisch und erzeugt
 * keine finalen Entscheidungen.
 */
export function interpretIntent(
  intent: Intent,
  resolvedFacts: ResolvedFact[]
): ActivitySuggestion[] {

  const suggestions: ActivitySuggestion[] = [];

  const text = intent.description.toLowerCase();

  // -------------------------------------------------
  // Regel 1: IT / Software / Programmierung
  // -------------------------------------------------

  if (
    containsAny(text, [
      "software",
      "programmierung",
      "entwickeln",
      "it",
      "app",
      "anwendung"
    ])
  ) {
    suggestions.push({
      wzCode: "62.01",
      label: "Erbringung von Dienstleistungen der Informationstechnologie",
      confidence: 0.8,
      justification:
        "Begriffe wie Software, IT oder Programmierung wurden erkannt.",
      ruleRefs: ["INTENT_IT_001"]
    });
  }

  // -------------------------------------------------
  // Regel 2: Web / Webseiten
  // -------------------------------------------------

  if (
    containsAny(text, [
      "web",
      "webseite",
      "homepage",
      "website",
      "internetauftritt"
    ])
  ) {
    suggestions.push({
      wzCode: "63.12",
      label: "Webportale und Webdienstleistungen",
      confidence: 0.6,
      justification:
        "Hinweise auf Webseiten oder Webauftritte wurden erkannt.",
      ruleRefs: ["INTENT_WEB_010"]
    });
  }

  // -------------------------------------------------
  // Regel 3: Beratung
  // -------------------------------------------------

  if (
    containsAny(text, [
      "beratung",
      "beraten",
      "consulting",
      "berater"
    ])
  ) {
    suggestions.push({
      wzCode: "70.22",
      label: "Unternehmensberatung",
      confidence: 0.5,
      justification:
        "Begriffe wie Beratung oder Consulting wurden erkannt.",
      ruleRefs: ["INTENT_CONSULTING_020"]
    });
  }

  // -------------------------------------------------
  // Deduplizierung (falls mehrere Regeln gleiche WZ treffen)
  // -------------------------------------------------

  return deduplicateByWzCode(suggestions);
}

/**
 * Hilfsfunktion: prüft, ob ein Text eines der Schlüsselwörter enthält
 */
function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword));
}

/**
 * Entfernt doppelte Vorschläge mit gleichem WZ-Code
 * (behält den mit der höchsten Confidence)
 */
function deduplicateByWzCode(
  suggestions: ActivitySuggestion[]
): ActivitySuggestion[] {

  const map = new Map<string, ActivitySuggestion>();

  for (const suggestion of suggestions) {
    const existing = map.get(suggestion.wzCode);

    if (!existing || (suggestion.confidence ?? 0) > (existing.confidence ?? 0)) {
      map.set(suggestion.wzCode, suggestion);
    }
  }

  return Array.from(map.values());
}
