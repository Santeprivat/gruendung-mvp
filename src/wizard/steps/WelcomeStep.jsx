function WelcomeStep({ onNext }) {
  return (
    <>
      <p>Willkommen im Mini One-Stop-Shop.</p>
      <p>Dieser Assistent führt Sie Schritt für Schritt durch den Prozess.</p>
      <button onClick={onNext}>Start</button>
    </>
  );
}

export default WelcomeStep;

