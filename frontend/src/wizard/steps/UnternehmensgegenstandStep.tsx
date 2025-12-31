import { useState } from "react";
import "./step.css";

interface Props {
  vorgang: any;
  onNext: (data: unknown) => void;
  onBack: () => void;
}

function UnternehmensgegenstandStep({ onNext, onBack }: Props) {
  const [rechtsform, setRechtsform] = useState("GmbH");
  const [name, setName] = useState("");
  const [taetigkeit, setTaetigkeit] = useState("62.01");

  function handleNext() {
    onNext({
      rechtsform,
      name,
      taetigkeiten: [
        {
          wz: taetigkeit,
          bezeichnung: "Softwareentwicklung",
        },
      ],
    });
  }

  return (
    <div className="step">
      <h2>Unternehmensgegenstand</h2>

      {/* Rechtsform */}
      <div className="form-group">
        <label>Rechtsform</label>
        <select
          value={rechtsform}
          onChange={(e) => setRechtsform(e.target.value)}
        >
          <option value="GmbH">GmbH</option>
          <option value="UG">UG (haftungsbeschränkt)</option>
          <option value="EK">e. K.</option>
        </select>
      </div>

      {/* Tätigkeit */}
      <div className="form-group">
        <label>Tätigkeit (WZ)</label>
        <select
          value={taetigkeit}
          onChange={(e) => setTaetigkeit(e.target.value)}
        >
          <option value="62.01">Softwareentwicklung</option>
          <option value="62.02">IT-Beratung</option>
        </select>
      </div>

      {/* Name */}
      <div className="form-group">
        <label>Vorgeschlagener Unternehmensname</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Muster Software GmbH"
        />
      </div>

      {/* Navigation */}
      <div className="step-actions">
        <button type="button" onClick={onBack}>
          Zurück
        </button>

        <button type="button" onClick={handleNext}>
          Weiter
        </button>
      </div>
    </div>
  );
}

export default UnternehmensgegenstandStep;
