# Unternehmensplattform – One-Stop-Shop für unternehmerische Lebenslagen

Diese Repository enthält die Unternehmensplattform als Grundlage für  
One-Stop-Shops für unternehmerische Lebenslagen (z. B. Gründung, Änderung, Stilllegung).

Die Plattform ist prozessgetrieben, backend-zentriert und erweiterbar  
für föderale Anbindungen (Bund / Länder / Behörden).

---

## Ziel der Plattform

- Unterstützung von Frontends („One-Stop-Shop“) für alle Lebenslagen eines Unternehmens. Zunächst liegt der Fokus auf Gründungen
- Fachliche Entscheidungen und Regeln nicht im Frontend
- Backend trägt Verantwortung für:
  - Vorgänge
  - Status
  - Audit
  - Entscheidungen (separat)
- Frontends - die One-Stop-Shops für Lebenslagen von Unternehmen - können von beliebigen akkreditierten Anbieter umgesetzt werden. Hier wird eine Beispielimplementierung eines Frontends


Merksatz:  
Das Frontend (der One-Stop-Shop) interpretiert Prozesse.  
Das Backend trägt Verantwortung.

---

## Architekturüberblick

Die Plattform besteht aus klar getrennten Verantwortungsbereichen.

### Frontend (One-Stop-Shop)
- Ein einziges Frontend = One-Stop-Shop
- Reiner Prozess-Interpreter (Wizard)
- Keine Fachlogik, keine Entscheidungen
- Lebenslagen sind Konfiguration, keine eigenen Anwendungen

### Backend
- Vorgangsservice
  - Existenz eines Vorgangs
  - Status
  - Daten (Tatsachen)
  - Audit (Events)
- Erlaubnisservice
  - Genehmigungen
  - Entscheidungen
  - Rechtsfolgen
- Services sind lose gekoppelt und API-getrieben

### API
- OpenAPI als verbindlicher Vertrag
- Frontend konsumiert
- Backend implementiert
- Verträge liegen zentral im Repository

---

## Repository-Struktur

unternehmensplattform/
- frontend/            One-Stop-Shop Frontend (React + Vite)
- backend/             Backend-Services
  - vorgangsservice/
  - erlaubnisservice/
- api/
  - contracts/         Verbindliche OpenAPI-Verträge
- docs/
  - architektur/       Architekturkonzepte
  - entscheidungen/    Architekturentscheidungen (ADRs)
- .gitignore
- README.md

---

## Frontend (lokal starten)

Das Frontend liegt unter `frontend/` und ist eine React/Vite-Anwendung.

Lokaler Start:

- In das Frontend-Verzeichnis wechseln  
  cd frontend

- Abhängigkeiten installieren  
  npm install

- Entwicklungsserver starten  
  npm run dev

Konfiguration erfolgt über Environment-Variablen, z. B.:

VITE_API_BASE_URL=http://localhost:3000

---

## API-Verträge

Die offiziellen API-Verträge liegen unter:

api/contracts/

Beispiel:
- vorgangsservice.openapi.yaml

Regel:  
Änderungen an APIs erfolgen zuerst in der OpenAPI  
und erst danach in Frontend oder Backend.

---

## Zentrale Architekturprinzipien

- Frontend trifft keine Entscheidungen
- Status ist nicht gleich Entscheidung
- Daten sind nicht gleich Genehmigungen
- Events sind nach Verantwortung getrennt
- Keine implizite Fachlogik im Frontend
- DSGVO Art. 22 und EU AI Act werden berücksichtigt

---

## Projektstatus

- Frontend-Grundstruktur stabil
- Repository-Struktur finalisiert
- OpenAPI-Vertrag für Vorgangsservice v0.1 vorhanden
- Backend-Implementierungen folgen
- Weitere Lebenslagen folgen schrittweise

---

## Hinweise

Dieses Projekt befindet sich in aktiver Entwicklung.  
Lizenz- und Nutzungsdetails werden zu einem späteren Zeitpunkt ergänzt.
