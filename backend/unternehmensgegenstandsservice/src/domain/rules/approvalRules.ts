// src/domain/rules/approvalRules.ts

import {
  ActivitySuggestion,
  ApprovalRequirement,
  Context,
  ResolvedFact
} from "../model/domainTypes";

/**
 * Leitet potenzielle Genehmigungs- oder Anzeigeerfordernisse
 * aus den Tätigkeitsvorschlägen ab.
 *
 * Diese Regeln sind bewusst konservativ und transparent:
 * Sie zeigen auf, was erforderlich sein KÖNNTE, abhängig
 * von offenen Klärungen.
 */
export function deriveApprovals(
  activities: ActivitySuggestion[],
  context: Context,
  resolvedFacts: ResolvedFact[]
): ApprovalRequirement[] {

  const approvals: ApprovalRequirement[] = [];

  // -------------------------------------------------
  // Regel 1: IT-Dienstleistungen (i.d.R. genehmigungsfrei)
  // -------------------------------------------------

  const hasITActivity = activities.some(a => a.wzCode === "62.01");

  if (hasITActivity) {
    approvals.push({
      type: "TRADE_REGISTRATION",
      required: false,
      justification:
        "Reine IT-Dienstleistungen sind in der Regel nicht genehmigungspflichtig, unterliegen jedoch der Gewerbeanmeldung.",
      ruleRefs: ["APPROVAL_IT_001"]
    });
  }

  // -------------------------------------------------
  // Regel 2: Beratung mit Vermittlung (potenziell genehmigungspflichtig)
  // -------------------------------------------------

  const hasConsultingActivity = activities.some(a => a.wzCode === "70.22");
  const consultingScope = resolvedFacts.find(
    f => f.key === "CONSULTING_SCOPE"
  )?.value;

  if (hasConsultingActivity) {
    if (consultingScope === "WITH_INTERMEDIATION") {
      approvals.push({
        type: "INTERMEDIATION_LICENSE",
        required: true,
        justification:
          "Die Vermittlung von Verträgen oder Produkten kann eine Genehmigung nach Gewerberecht erfordern.",
        ruleRefs: ["APPROVAL_CONSULTING_010"]
      });
    } else if (!consultingScope) {
      approvals.push({
        type: "INTERMEDIATION_LICENSE",
        required: false,
        justification:
          "Ob eine Genehmigung erforderlich ist, hängt davon ab, ob eine Vermittlungstätigkeit ausgeübt wird.",
        dependsOnClarificationIds: ["CONSULTING_SCOPE"],
        ruleRefs: ["APPROVAL_CONSULTING_011"]
      });
    }
  }

  // -------------------------------------------------
  // Regel 3: Rechtsform-spezifische Hinweise (MVP)
  // -------------------------------------------------

  if (context.legalForm === "GMBH") {
    approvals.push({
      type: "COMMERCIAL_REGISTER_ENTRY",
      required: true,
      justification:
        "Kapitalgesellschaften wie die GmbH müssen in das Handelsregister eingetragen werden.",
      ruleRefs: ["APPROVAL_LEGALFORM_020"]
    });
  }

  return approvals;
}
