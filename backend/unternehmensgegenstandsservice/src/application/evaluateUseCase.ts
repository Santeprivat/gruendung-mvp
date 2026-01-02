// src/application/evaluateUseCase.ts

import {
  EvaluateRequest,
  EvaluateResponse,
  ActivitySuggestion,
  Clarification,
  ApprovalRequirement,
  CompanyNameAssessment,
  Proposal
} from "../domain/model/domainTypes";

// Regel-Module (MVP-Stubs – werden schrittweise gefüllt)
import { interpretIntent } from "../domain/intent/intentInterpreter";
import { determineClarifications } from "../domain/rules/clarificationRules";
import { deriveApprovals } from "../domain/rules/approvalRules";
import { assessCompanyName } from "../domain/rules/nameRules";
import { buildProposal } from "../domain/proposal/proposalBuilder";

/**
 * Zentrale fachliche Orchestrierung der Bewertung.
 *
 * Diese Funktion ist zustandslos und deterministisch.
 * Sie wertet einen Request vollständig aus und liefert
 * ein fachliches Ergebnis zurück.
 */
export function evaluateUseCase(
  request: EvaluateRequest
): EvaluateResponse {
    
  // --- 1. Grundlegende Initialisierung ------------------------------

  const activitySuggestions: ActivitySuggestion[] = [];
  const clarifications: Clarification[] = [];
  const approvalRequirements: ApprovalRequirement[] = [];

  // --- 2. Intent interpretieren ------------------------------------

  if (request.intent) {
    const interpretedActivities = interpretIntent(
      request.intent,
      request.resolvedFacts ?? []
    );

    activitySuggestions.push(...interpretedActivities);
  }

  // --- 3. Klärungsbedarfe ermitteln --------------------------------

  const detectedClarifications = determineClarifications(
    activitySuggestions,
    request.resolvedFacts ?? []
  );

  clarifications.push(...detectedClarifications);

  // --- 4. Genehmigungen ableiten -----------------------------------

  const derivedApprovals = deriveApprovals(
    activitySuggestions,
    request.context,
    request.resolvedFacts ?? []
  );

  approvalRequirements.push(...derivedApprovals);

  // --- 5. Unternehmensname bewerten --------------------------------

  let companyNameAssessment: CompanyNameAssessment | undefined;

  if (request.proposedCompanyName) {
    companyNameAssessment = assessCompanyName(
      request.proposedCompanyName,
      activitySuggestions
    );
  }

  // --- 6. Prüfen: ist der Vorgang fachlich abschließbar? ------------

  const hasBlockingClarifications = clarifications.some(
    c => c.severity === "BLOCKING"
  );

  if (hasBlockingClarifications) {
    return {
      activitySuggestions,
      clarifications,
      approvalRequirements,
      companyNameAssessment,
      overallResult: "INCOMPLETE"
    };
  }

  // --- 7. Proposal bauen -------------------------------------------

  const proposal: Proposal | undefined = buildProposal(
    activitySuggestions,
    approvalRequirements,
    request.proposedCompanyName
  );

  if (!proposal) {
    return {
      activitySuggestions,
      clarifications,
      approvalRequirements,
      companyNameAssessment,
      overallResult: "NOT_ALLOWED"
    };
  }

  // --- 8. Erfolgreicher Abschluss ----------------------------------

  return {
    activitySuggestions,
    clarifications: [],
    approvalRequirements,
    companyNameAssessment,
    proposal,
    overallResult: "ALLOWED"
  };
}
