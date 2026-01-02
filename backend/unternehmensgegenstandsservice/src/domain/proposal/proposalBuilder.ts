// src/domain/proposal/proposalBuilder.ts

import {
  ActivitySuggestion,
  ApprovalRequirement,
  ConfirmedActivity,
  Proposal
} from "../model/domainTypes";

/**
 * Baut einen konsistenten fachlichen Proposal aus
 * Tätigkeitsvorschlägen und abgeleiteten Genehmigungen.
 *
 * Gibt `undefined` zurück, wenn kein konsistenter
 * Proposal gebildet werden kann.
 */
export function buildProposal(
  activitySuggestions: ActivitySuggestion[],
  approvalRequirements: ApprovalRequirement[],
  proposedCompanyName?: string
): Proposal | undefined {

  // -------------------------------------------------
  // 1. Mindestvoraussetzung: mindestens eine Tätigkeit
  // -------------------------------------------------

  if (!activitySuggestions || activitySuggestions.length === 0) {
    return undefined;
  }

  // -------------------------------------------------
  // 2. Tätigkeiten konsolidieren
  // -------------------------------------------------

  const confirmedActivities: ConfirmedActivity[] =
    activitySuggestions.map(a => ({
      wzCode: a.wzCode,
      label: a.label
    }));

  // -------------------------------------------------
  // 3. (MVP) Verbotene Kombinationen prüfen
  // -------------------------------------------------
  // Beispiel: In späteren Versionen könnten hier
  // Tätigkeitskombinationen ausgeschlossen werden.
  // Für v0.1 gibt es keine harten Ausschlüsse.

  // -------------------------------------------------
  // 4. Proposal aufbauen
  // -------------------------------------------------

  const proposal: Proposal = {
    activities: confirmedActivities,
    approvals: approvalRequirements,
    explanation: buildExplanation(
      confirmedActivities,
      approvalRequirements
    )
  };

  if (proposedCompanyName) {
    proposal.companyName = proposedCompanyName;
  }

  return proposal;
}

/**
 * Baut eine einfache erklärende Zusammenfassung
 * für Transparenz / Summary-Anzeige.
 */
function buildExplanation(
  activities: ConfirmedActivity[],
  approvals: ApprovalRequirement[]
): string {

  const activityText =
    activities.length === 1
      ? `Die Tätigkeit "${activities[0].label}" wurde identifiziert.`
      : `Es wurden ${activities.length} Tätigkeiten identifiziert.`;

  const approvalText =
    approvals.length === 0
      ? "Es wurden keine Genehmigungserfordernisse festgestellt."
      : `Es wurden ${approvals.length} Genehmigungserfordernisse identifiziert.`;

  return `${activityText} ${approvalText}`;
}
