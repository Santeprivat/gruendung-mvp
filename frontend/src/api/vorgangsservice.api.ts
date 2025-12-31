const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL ist nicht gesetzt");
}

/**
 * Startet einen neuen Vorgang
 */
export async function createVorgang(typ: string) {
  const response = await fetch(`${API_BASE_URL}/vorgaenge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ typ }),
  });

  if (!response.ok) {
    throw new Error("Vorgang konnte nicht angelegt werden");
  }

  return response.json();
}

/**
 * Lädt einen bestehenden Vorgang
 */
export async function getVorgang(vorgangId: string) {
  const response = await fetch(
    `${API_BASE_URL}/vorgaenge/${vorgangId}`
  );

  if (!response.ok) {
    throw new Error("Vorgang nicht gefunden");
  }

  return response.json();
}

/**
 * Ändert den Status eines Vorgangs
 */
export async function updateVorgangStatus(
  vorgangId: string,
  status: string
) {
  const response = await fetch(
    `${API_BASE_URL}/vorgaenge/${vorgangId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Status konnte nicht geändert werden");
  }
}

/**
 * Fügt Daten zu einem Vorgang hinzu oder ändert sie
 */
export async function updateVorgangDaten(
  vorgangId: string,
  daten: Record<string, unknown>
) {
  const response = await fetch(
    `${API_BASE_URL}/vorgaenge/${vorgangId}/daten`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(daten),
    }
  );

  if (!response.ok) {
    throw new Error("Vorgangsdaten konnten nicht gespeichert werden");
  }
}
