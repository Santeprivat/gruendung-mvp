// src/domain/model/domainTypes.ts

/**
 * Kontext der Bewertung (Rechtsordnung, Rechtsform etc.)
 */
export interface Context {
  jurisdiction: string; // z.B. "DE"
  legalForm: string;    // z.B. "GMBH"
}

/**
 * Unstrukturierte Gründungsabsicht (Freitext)
 */
export interface Intent {
  description: string;
}

/**
 * Bereits geklärte Tatsache aus dem Dialog
 */
export interface ResolvedFact {
  key: string;                    // z.B. "SOFTWARE_TYPE"
  value: string;                  // z.B. "STANDARD"
  sourceClarificationId?: string; // optionale Referenz
}

/**
 * Vorschlag einer Tätigkeit (noch nicht final)
 */
export interface ActivitySuggestion {
  wzCode: string;
  label: string;
  confidence?: number;      // 0..1, nur erklärend
  justification?: string;
  ruleRefs?: string[];
}

/**
 * Rückfrage zur Klärung einer fachlichen Unschärfe
 */
export interface Clarification {
  id: string;
  question: string;
  options?: ClarificationOption[];
  impact?: string;
  severity: "BLOCKING" | "NON_BLOCKING";
  ruleRefs?: string[];
}

/**
 * Antwortoption zu einer Clarification
 */
export interface ClarificationOption {
  factKey: string;
  code: string;
  label: string;
}

/**
 * Fachliche Plausibilitätsbewertung eines Unternehmensnamens
 * (keine rechtliche Verfügbarkeitsprüfung!)
 */
export interface CompanyNameAssessment {

  /**
   * Ergebnis der fachlichen Bewertung
   */
  result: "ALLOWED" | "RISKY" | "NOT_ALLOWED";

  /**
   * Erläuternde Hinweise zur Bewertung
   */
  notes?: string[];

  /**
   * Kennzeichnet, dass eine externe rechtliche Namensprüfung
   * (z. B. Handelsregister, Kammern) erforderlich ist.
   *
   * WICHTIG:
   * - sagt NICHT, ob die Prüfung bereits erfolgt ist
   * - sagt NICHT, ob der Name verfügbar ist
   */
  availabilityCheckRequired: boolean;

  /**
   * Begründung, warum eine externe Namensprüfung erforderlich ist
   */
  availabilityCheckReason?: string;

  /**
   * Fachlich plausible Alternativnamen (Backup-Namen),
   * die NICHT rechtlich geprüft sind
   */
  alternativeNameSuggestions?: NameSuggestion[];

  /**
   * Referenzen auf angewendete Namensregeln
   */
  ruleRefs?: string[];
}


/**
 * Abgeleitetes Genehmigungs- oder Anzeigeerfordernis
 */
export interface ApprovalRequirement {
  type: string;               // z.B. "TRADE"
  required: boolean;
  justification?: string;
  dependsOnClarificationIds?: string[];
  ruleRefs?: string[];
}

/**
 * Fachlich plausibler Alternativname (nicht geprüft!)
 */
export interface NameSuggestion {
  /**
   * Vorgeschlagener alternativer Unternehmensname
   */
  name: string;

  /**
   * Begründung, warum dieser Name fachlich passt
   */
  justification?: string;

  /**
   * Art der Variation gegenüber dem Primärnamen
   */
  variationType?: "SUFFIX" | "PREFIX" | "DESCRIPTOR" | "REORDERING";
}

/**
 * Bestätigte Tätigkeit im finalen Vorschlag
 */
export interface ConfirmedActivity {
  wzCode: string;
  label: string;
}

/**
 * Konsistenter fachlicher Vorschlag (Ergebnis)
 */
export interface Proposal {
  activities: ConfirmedActivity[];
  companyName?: string;
  approvals?: ApprovalRequirement[];
  explanation?: string;
  ruleSnapshot?: Record<string, unknown>;
}

/**
 * Request für die fachliche Bewertung
 */
export interface EvaluateRequest {
  context: Context;
  intent?: Intent;
  resolvedFacts?: ResolvedFact[];
  proposedCompanyName?: string;
}

/**
 * Gesamt-Ergebnis der Bewertung
 */
export interface EvaluateResponse {
  activitySuggestions: ActivitySuggestion[];
  clarifications: Clarification[];
  companyNameAssessment?: CompanyNameAssessment;
  approvalRequirements: ApprovalRequirement[];
  proposal?: Proposal;
  overallResult: "INCOMPLETE" | "ALLOWED" | "NOT_ALLOWED";
}
