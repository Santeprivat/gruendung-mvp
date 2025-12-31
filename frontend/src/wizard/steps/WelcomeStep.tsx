interface Props {
  onNext: () => void;
}

function WelcomeStep({ onNext }: Props) {
  return (
    <>
      <h2>Willkommen</h2>
      <p>
        Dieser Assistent führt Sie Schritt für Schritt
        durch die digitale Unternehmensgründung.
      </p>

      <button
        type="button"
        onClick={() => {
          console.log("Start geklickt");
          onNext();
        }}
      >
        Starten
      </button>
    </>
  );
}

export default WelcomeStep;
