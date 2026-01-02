// src/domain/rules/clarificationRules.ts

import {
  ActivitySuggestion,
  Clarification,
  ResolvedFact
} from "../model/domainTypes";

/**
 * Ermittelt fachlich notwendige Klärungsbedarfe
 * auf Basis der erkannten Tätigkeitsvorschläge
 * und bereits geklärter Tatsachen.
 */
export function determineClarifications(
  activities: ActivitySuggestion[],
  resolvedFacts: ResolvedFact[]
): Clarification[] {

  const clarifications: Clarification[] = [];

  // -------------------------------------------------
  // Regel 1: Softwareentwicklung – Art der Software
  // -------------------------------------------------

  const hasITActivity = activities.some(a => a.wzCode === "62.01");
  const hasSoftwareTypeFact = resolvedFacts.some(
    f => f.key === "SOFTWARE_TYPE"
  );

  if (hasITActivity && !hasSoftwareTypeFact) {
    clarifications.push({
      id: "IT_SOFTWARE_TYPE",
      question:
        "Welche Art von Software soll entwickelt oder angeboten werden?",
      options: [
        {
          factKey: "SOFTWARE_TYPE",
          code: "INDIVIDUAL",
          label: "Individualsoftware für einzelne Kunden"
        },
        {
          factKey: "SOFTWARE_TYPE",
          code: "STANDARD",
          label: "Standardsoftware für mehrere Kunden"
        }
      ],
      impact:
        "Die Art der Software beeinflusst die genaue Tätigkeitsabgrenzung und mögliche Genehmigungen.",
      severity: "BLOCKING",
      ruleRefs: ["CLARIFY_SOFTWARE_TYPE_001"]
    });
  }

  // -------------------------------------------------
  // Regel 2: Beratung – reine Beratung oder Vermittlung?
  // -------------------------------------------------

  const hasConsultingActivity = activities.some(a => a.wzCode === "70.22");
  const hasConsultingScopeFact = resolvedFacts.some(
    f => f.key === "CONSULTING_SCOPE"
  );

  if (hasConsultingActivity && !hasConsultingScopeFact) {
    clarifications.push({
      id: "CONSULTING_SCOPE",
      question:
        "Umfasst die Beratung auch die Vermittlung von Verträgen oder Produkten?",
      options: [
        {
          factKey: "CONSULTING_SCOPE",
          code: "ADVISORY_ONLY",
          label: "Nein, es handelt sich ausschließlich um Beratung"
        },
        {
          factKey: "CONSULTING_SCOPE",
          code: "WITH_INTERMEDIATION",
          label: "Ja, es werden auch Verträge oder Produkte vermittelt"
        }
      ],
      impact:
        "Eine Vermittlungstätigkeit kann zusätzliche Genehmigungspflichten auslösen.",
      severity: "BLOCKING",
      ruleRefs: ["CLARIFY_CONSULTING_SCOPE_010"]
    });
  }

  // -------------------------------------------------
  // Regel 3: Mehrere Tätigkeiten – Schwerpunkt?
  // (MVP: NON_BLOCKING)
  // -------------------------------------------------

  if (activities.length > 1) {
    clarifications.push({
      id: "ACTIVITY_FOCUS",
      question:
        "Welche Tätigkeit stellt den Schwerpunkt des Unternehmens dar?",
      options: activities.map(a => ({
        factKey: "PRIMARY_ACTIVITY",
        code: a.wzCode,
        label: a.label
      })),
      impact:
        "Der Tätigkeitsschwerpunkt dient der besseren Beschreibung des Unternehmensgegenstands.",
      severity: "NON_BLOCKING",
      ruleRefs: ["CLARIFY_ACTIVITY_FOCUS_020"]
    });
  }

  return clarifications;
}
