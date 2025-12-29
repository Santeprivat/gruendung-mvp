import { useEffect, useState } from "react";
import { fetchHello } from "../api/helloApi";
import { steps } from "./steps";

function Wizard() {
  // ─────────────────────────────
  // State
  // ─────────────────────────────
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // ─────────────────────────────
  // Navigation
  // ─────────────────────────────
  function nextStep() {
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  // ─────────────────────────────
  // Side effect: Daten laden nur in Schritt 2
  // ─────────────────────────────
  useEffect(() => {
    if (step !== 2) return;

    setStatus("loading");
    setError("");

    fetchHello()
      .then((result) => {
        setData(result);
        setStatus("success");
      })
      .catch(() => {
        setError("Fehler beim Laden");
        setStatus("error");
      });
  }, [step]);

  // ─────────────────────────────
  // Aktuellen Schritt bestimmen
  // ─────────────────────────────
  const currentStep = steps.find((s) => s.id === step);
  const StepComponent = currentStep?.component;

  // ─────────────────────────────
  // Render
  // ─────────────────────────────
  return (
    <>
      {StepComponent ? (
        <StepComponent
          onNext={nextStep}
          onBack={prevStep}
          status={status}
          data={data}
          error={error}
        />
      ) : (
        <p>Unbekannter Schritt</p>
      )}
    </>
  );
}

export default Wizard;
