# Namensprüfungsservice

## Überblick

Der **Namensprüfungsservice** ist ein externer, rechtsformabhängiger Prüfservice zur
**rechtlichen Verfügbarkeitsprüfung von Unternehmensnamen**.

Er prüft, ob ein vorgeschlagener Unternehmensname bereits vergeben ist oder
eine Verwechslungsgefahr besteht – abhängig von:

- Rechtsform (z. B. GmbH, e.K., Verein)
- Jurisdiktion (z. B. DE)
- zuständigem Register oder Verzeichnis (z. B. Handelsregister, Kammern)

Der Service ist **zustandslos**, **speichert keine Daten** und trifft **keine
prozessualen Entscheidungen**.

---

## Abgrenzung

### Der Service ist verantwortlich für
- rechtliche Namensverfügbarkeitsprüfungen
- rechtsformabhängige Registerzuordnung
- Aggregation von Prüfergebnissen
- transparente Rückgabe von Konflikten oder Unsicherheiten

### Der Service ist **nicht** verantwortlich für
- fachliche Namensplausibilität (Branche, Irreführung)
- Tätigkeits- oder WZ-Prüfungen
- Persistenz oder Vorgangsverwaltung
- Benutzer- oder Rollenlogik
- Prozesssteuerung oder Statuswechsel

---

## Rolle im Gesamtsystem

Der Namensprüfungsservice wird **nicht direkt vom Frontend** aufgerufen.

Typischer Ablauf:

1. Unternehmensgegenstandsservice stellt fachliche Plausibilität fest  
2. Proposal wird im Vorgangsservice gespeichert  
3. Prozess-Orchestrierung ruft den Namensprüfungsservice auf  
4. Ergebnis fließt als Tatsache in den Vorgang zurück  

Der Service liefert **reine Prüfergebnisse**, keine Entscheidungen.

---

## Fachliches Grundprinzip

> **Name + Rechtsform + Jurisdiktion → rechtliche Verfügbarkeit**

Die Prüfung kann ergeben:
- eindeutig verfügbar
- eindeutig nicht verfügbar
- nicht eindeutig prüfbar (z. B. Register nicht erreichbar)

---

## Zentrale fachliche Begriffe

### NameCheckRequest
Prüfanfrage mit Name, Rechtsform und Jurisdiktion.

### NameAvailabilityResult
Ergebnis der Prüfung (AVAILABLE, CONFLICT, UNKNOWN).

### RegisterSource
Angabe, gegen welche Register oder Verzeichnisse geprüft wurde.

---

## Technische Leitplanken

- eigener Backend-Service
- eigene OpenAPI-Spezifikation
- synchrones API (MVP)
- stateless
- externe Register als Adapter
- föderationsfähig (Register je Rechtsform austauschbar)

---

## Status

- Service konzeptionell definiert
- Integration über Prozess-Orchestrierung vorgesehen
- OpenAPI v0.1 in Vorbereitung
