export interface UnternehmensgegenstandErgebnis {
  rechtsform: string;

  taetigkeiten: {
    wz: string;
    bezeichnung: string;
  }[];

  name: {
    vorschlag: string;
    zulaessig: boolean;
    hinweise: string[];
  };

  genehmigungen: {
    typ: string;
    bezeichnung: string;
    erforderlich: boolean;
  }[];
}

/**
 * SIMULATION des Unternehmensgegenstandsservice
 * (später echter Backend-Service)
 */
export async function pruefeUnternehmensgegenstand(input: {
  rechtsform: string;
  taetigkeiten: { wz: string; bezeichnung: string }[];
  name: string;
}): Promise<UnternehmensgegenstandErgebnis> {
  // Simulierter Delay
  await new Promise((r) => setTimeout(r, 500));

  return {
    rechtsform: input.rechtsform,

    taetigkeiten: input.taetigkeiten,

    name: {
      vorschlag: input.name,
      zulaessig: true,
      hinweise: [],
    },

    genehmigungen: [
      {
        typ: "KEINE",
        bezeichnung: "Keine besonderen Genehmigungen erforderlich",
        erforderlich: false,
      },
    ],
  };
}
