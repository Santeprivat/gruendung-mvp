import { useEffect, useState } from "react";

import {
  createVorgang,
  updateVorgangDaten,
  updateVorgangStatus,
  getVorgang,
} from "../api/vorgangsservice.api";

import {
  pruefeUnternehmensgegenstand,
} from "../api/unternehmensgegenstandsservice.api";

import { stepRegistry } from "./stepRegistry";

import type { Vorgang } from "./vorgangTypes";
import type { ProcessDefinition } from "./processTypes";

import { loadProcessDefinition } from "./loadProcessDefinition";
import WizardLayout from "./WizardLayout";

const UNTERNEHMENSGEGENSTAND_STEP_ID = "unternehmensgegenstand";

/**
 * Wizard
 * ======
 * Reiner Prozess-Interpreter.
 *
 * - sammelt Eingaben
 * - ruft fachliche Services auf
 * - speichert Ergebnisse im Vorgangsservice
 * - lädt danach die Backend-Wahrheit neu
 *
 * KEINE fachlichen Entscheidungen im Frontend.
 */
function Wizard() {
  // ─────────────────────────────
  // Prozessdefinition
  // ─────────────────────────────
  const [processDefinition, setProcessDefinition] =
    useState<ProcessDefinition | null>(null);
  const [processError, setProcessError] =
    useState<string | null>(null);

  // ─────────────────────────────
  // Vorgang (lokaler Spiegel des Backends)
  // ─────────────────────────────
  const [vorgang, setVorgang] = useState<Vorgang | null>(null);

  // ─────────────────────────────
  // UI-Status
  // ─────────────────────────────
  const [uiStatus, setUiStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");

  // ─────────────────────────────
  // Prozessdefinition laden
  // ─────────────────────────────
  useEffect(() => {
    loadProcessDefinition()
      .then(setProcessDefinition)
      .catch((err) =>
        setProcessError(err?.message ?? "Fehler beim Laden des Prozesses")
      );
  }, []);

  // ─────────────────────────────
  // Vorgang im Backend anlegen
  // ─────────────────────────────
  useEffect(() => {
    if (!processDefinition || vorgang) return;

    setUiStatus("loading");

    createVorgang("GRUENDUNG")
      .then((backendVorgang) => {
        setVorgang({
          id: backendVorgang.id,
          status: backendVorgang.status,
          currentStepId: processDefinition.initialStep,
          domainDataContributions: {},
        });
        setUiStatus("idle");
      })
      .catch(() => {
        setProcessError("Vorgang konnte nicht initialisiert werden");
        setUiStatus("error");
      });
  }, [processDefinition, vorgang]);

  // ─────────────────────────────
  // Guards
  // ─────────────────────────────
  if (processError) return <p>Fehler: {processError}</p>;
  if (!processDefinition) return <p>Lade Prozessdefinition …</p>;
  if (!vorgang) return <p>Initialisiere Vorgang …</p>;

  // ─────────────────────────────
  // Aktueller Schritt
  // ─────────────────────────────
  const stepDef = processDefinition.steps[vorgang.currentStepId];
  if (!stepDef) {
    return <p>Unbekannter Schritt: {vorgang.currentStepId}</p>;
  }

  const StepComponent = stepRegistry[stepDef.component];
  if (!StepComponent) {
    return <p>Unbekannte Komponente: {stepDef.component}</p>;
  }

  // ─────────────────────────────
  // Next
  // ─────────────────────────────
  async function nextStep(domainDataContribution?: unknown) {
    if (!stepDef.next || !vorgang) return;

    try {
      setUiStatus("loading");

      // 🟦 Spezialfall: Unternehmensgegenstand
      if (
        vorgang.currentStepId === UNTERNEHMENSGEGENSTAND_STEP_ID &&
        domainDataContribution
      ) {
        const ergebnis =
          await pruefeUnternehmensgegenstand(
            domainDataContribution as any
          );

        await updateVorgangDaten(vorgang.id, {
          unternehmerischeAusgangslage: {
            stand: "GEPRUEFT",
            unternehmensgegenstand: ergebnis,
          },
        });
      }
      // 🟦 Standardfall
      else if (domainDataContribution !== undefined) {
        await updateVorgangDaten(vorgang.id, {
          [vorgang.currentStepId]: domainDataContribution,
        });
      }

      // Statuswechsel (blind, Backend entscheidet)
      await updateVorgangStatus(vorgang.id, "IN_BEARBEITUNG");

      // 🔑 ZENTRALER SCHRITT:
      // Vorgang erneut aus dem Backend laden
      const aktualisierterVorgang = await getVorgang(vorgang.id);

      // Lokalen Wizard-State aktualisieren
      setVorgang((v) =>
        v
          ? {
              ...v,
              status: aktualisierterVorgang.status,
              domainDataContributions: {
                ...v.domainDataContributions,
                ...aktualisierterVorgang.daten,
              },
              currentStepId: stepDef.next!,
            }
          : v
      );

      setUiStatus("idle");
    } catch {
      setUiStatus("error");
    }
  }

  // ─────────────────────────────
  // Back (rein lokal)
  // ─────────────────────────────
  function prevStep() {
    if (!stepDef.back) return;

    setVorgang((v) =>
      v ? { ...v, currentStepId: stepDef.back! } : v
    );
  }

  // ─────────────────────────────
  // Render
  // ─────────────────────────────
  return (
    <WizardLayout>
      <StepComponent
        vorgang={vorgang}
        onNext={nextStep}
        onBack={prevStep}
        uiStatus={uiStatus}
      />
    </WizardLayout>
  );
}

export default Wizard;
