# DECISIONS.md – Between

## 2025-02-20: Tech Stack
**Entscheid:** Phaser 3 + TypeScript + Vite
**Warum:** Browser-basiert (null Setup-Friction), TypeScript für Struktur, Vite für Hot Reload. Claude Code exzellent mit TypeScript.
**Alternativen verworfen:** Godot (Installation nötig), Pygame (weniger Engine-Features)

## 2025-02-20: Perspektive
**Entscheid:** 3/4-Ansicht (Top-Down mit Tiefe)
**Warum:** Standard für Roguelikes, einfachere Physik als Isometrie, riesige Asset-Auswahl.
**Alternativen verworfen:** Echte Isometrie (zu komplex für Session 1)

## 2025-02-20: Biome-Strategie
**Entscheid:** 6 Dimensionen, Start mit "The Machine"
**Warum:** Pupkin Tech Dungeon liefert komplettes 32x32 Asset Pack (Tiles, Characters, Enemies, Boss, UI, Projektile). Weitere Biome werden inkrementell ergänzt sobald passende Assets gefunden werden. Core-Systeme sind biome-agnostisch.
**Erkenntnis:** Biome brauchen wirklich eigene Tilesets. Shader/Farbfilter allein reichen nicht für radikal verschiedene Welten.

## 2025-02-20: Asset-Strategie
**Entscheid:** 32x32 Pixel Art + Phaser Effekte (Lighting, Particles, Shake)
**Warum:** Grösstes Angebot an Assets in dieser Grösse, mit Post-Processing polierter Indie-Look. Verschiedene Packs pro Biome ist Feature, nicht Bug.
**Start-Assets:** Pupkin Tech Dungeon (£2.99 Vollversion) für "The Machine"

## 2025-02-20: Scene-Flow
**Entscheid:** SplashScene → BootScene → TitleScene → GameScene → GameOverScene
**Warum:** Professioneller Auftritt. Ceccaroni Games Branding zuerst, dann Asset-Loading, dann Spieltitel. Standard in der Industrie.
