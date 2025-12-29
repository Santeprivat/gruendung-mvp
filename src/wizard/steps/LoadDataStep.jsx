function LoadDataStep({ status, data, error, onBack }) {
  return (
    <>
      <h2>Schritt 2: Daten laden</h2>

      {status === "loading" && <p>Lade Daten…</p>}
      {status === "error" && <p>{error}</p>}
      {status === "success" && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}

      <button onClick={onBack}>Zurück</button>
    </>
  );
}

export default LoadDataStep;
