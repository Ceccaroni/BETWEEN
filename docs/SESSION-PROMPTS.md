# SESSION-PROMPTS.md – Between

## Start-Prompt (jede Session an Claude Code)

```
Lies CLAUDE.md, docs/STATUS.md und docs/ARCHITECTURE.md.

Fasse zusammen:
1. Was ist der aktuelle Stand?
2. Was war das Ziel der letzten Session – wurde es erreicht?
3. Was sind die offenen Punkte?

Warte dann auf unser heutiges Ziel.
```

## End-Prompt (jede Session an Claude Code)

```
Session-Abschluss. Bitte:

1. Update docs/STATUS.md:
   - Was haben wir heute geschafft?
   - Neuer stabiler Stand / Tag?
   - Known Bugs?
   - Vorschläge für nächste Session?

2. Update docs/ARCHITECTURE.md falls sich Struktur verändert hat.

3. Update docs/DECISIONS.md falls Architektur-Entscheide getroffen wurden.

4. Sauberer Commit mit aussagekräftiger Message.

5. Wenn Milestone: schlage Git-Tag vor.
```

## Erste Session – Spezieller Start-Prompt

```
Lies CLAUDE.md, docs/STATUS.md, docs/ARCHITECTURE.md und docs/tickets/TICKET-001.md.

Das ist die allererste Session. Deine Aufgaben:

1. Lösche die Datei LICENSE aus dem Repo.
2. Führe TICKET-001 komplett aus.
3. Wir werden dir gleich eine PNG-Datei hochladen: das Ceccaroni Games Logo.
   Lege es in src/assets/branding/ceccaroni-games.png ab.
4. Arbeite Schritt für Schritt gemäss dem Ticket.
5. Am Ende: Commit, Tag v0.0-setup, STATUS.md updaten.

Los geht's.
```
