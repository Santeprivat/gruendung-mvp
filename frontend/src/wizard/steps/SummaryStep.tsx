interface Props {
  vorgang: any;
  onBack: () => void;
}

function SummaryStep({ vorgang, onBack }: Props) {

  const ausgangslage =
    vorgang.domainDataContributions
      ?.unternehmerischeAusgangslage
      ?.unternehmensgegenstand;

  if (!ausgangslage) {
    return <p>Keine Unternehmensdaten vorhanden.</p>;
  }

  return (
    <div>
      <h2>Zusammenfassung</h2>

      <h3>Rechtsform</h3>
      <p>{ausgangslage.rechtsform}</p>

      <h3>Tätigkeiten</h3>
      <ul>
        {ausgangslage.taetigkeiten.map((t: any) => (
          <li key={t.wz}>
            {t.wz} – {t.bezeichnung}
          </li>
        ))}
      </ul>

      <h3>Unternehmensname</h3>
      <p>{ausgangslage.name.vorschlag}</p>

      <h3>Genehmigungen</h3>
      <ul>
        {ausgangslage.genehmigungen.map((g: any, i: number) => (
          <li key={i}>
            {g.bezeichnung} (
            {g.erforderlich ? "erforderlich" : "nicht erforderlich"})
          </li>
        ))}
      </ul>

      <button type="button" onClick={onBack}>
        Zurück
      </button>
    </div>
  );
}

export default SummaryStep;
