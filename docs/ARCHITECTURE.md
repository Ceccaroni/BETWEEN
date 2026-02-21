# ARCHITECTURE.md – Between

## Übersicht
Multi-Biome Roguelike. Core-Systeme sind biome-agnostisch.
Jedes Biome liefert eigene Tiles, Enemies, Mechaniken.
6 Dimensionen, Start mit "The Machine".

## Projektstruktur
```
between/
├── CLAUDE.md                   # Regeln für Claude Code
├── index.html                  # Entry HTML (responsive meta tags)
├── docs/
│   ├── STATUS.md               # Aktueller Stand
│   ├── ARCHITECTURE.md         # Dieses Dokument
│   ├── DECISIONS.md            # Architektur-Entscheide
│   ├── LORE.md                 # Spielwelt, Story, Dimensionen
│   └── ISSUE-T002-visual-fixes.md  # Offenes Issue: Tile/Player Fixes
├── src/
│   ├── main.ts                 # Phaser Game Config + Scale Manager
│   ├── scenes/
│   │   ├── BootScene.ts        # Asset Loading + Ladebalken
│   │   ├── SplashScene.ts      # Ceccaroni Logo (Fullscreen Artwork)
│   │   ├── TitleScene.ts       # BETWEEN Titel (Fullscreen Artwork)
│   │   ├── MenuScene.ts        # Hauptmenü (Fullscreen Artwork + Menu)
│   │   ├── GameScene.ts        # Haupt-Gameplay
│   │   ├── GameOverScene.ts    # Death Screen
│   │   ├── CreditsScene.ts     # Credits + ESC zurück
│   │   ├── SettingsScene.ts    # Sound/Game/Player Einstellungen
│   │   └── TestScene.ts        # Tileset Debug Grid + Sandbox
│   ├── entities/
│   │   ├── Player.ts           # Spieler (FreeKnight, Arcade Sprite, Scale 2×)
│   │   ├── Enemy.ts            # Basis-Enemy (geplant)
│   │   └── Projectile.ts       # Geschosse (geplant)
│   ├── systems/
│   │   ├── InputSystem.ts      # WASD + Pfeiltasten, 8-Richtungen
│   │   ├── AudioSystem.ts      # Musik (Fade-In/Out, Loop) + SFX
│   │   ├── DungeonGenerator.ts # Raum mit Pupkin Tiles (20×11, Scale 2×)
│   │   ├── CombatSystem.ts     # Damage, Health, Death (geplant)
│   │   ├── LootSystem.ts       # Item Drops (geplant)
│   │   └── BiomeManager.ts     # Biome-Loading (geplant)
│   ├── biomes/
│   │   ├── machine/            # Dimension 1: The Machine
│   │   ├── organism/           # Dimension 2: The Organism
│   │   ├── library/            # Dimension 3: The Library
│   │   ├── clockwork/          # Dimension 4: The Clockwork
│   │   ├── abyss/              # Dimension 5: The Abyss
│   │   └── dream/              # Dimension 6: The Dream
│   ├── ui/                     # HUD, Inventar (geplant)
│   └── utils/
│       └── Constants.ts        # GAME_WIDTH=1280, GAME_HEIGHT=720, etc.
├── public/
│   └── assets/
│       ├── branding/           # Fullscreen Artworks (splash, title, menu)
│       ├── characters/player/  # FreeKnight Player (8 Sheets) + Pupkin Backup
│       ├── enemies/machine/    # Pupkin Enemy Spritesheet
│       ├── tilesets/machine/   # Pupkin Tileset
│       ├── props/machine/      # Pupkin Props Spritesheet
│       ├── effects/projectiles/# Pupkin Projectiles
│       ├── ui/machine/         # Pupkin UI
│       └── audio/
│           ├── music/          # title-theme.mp3
│           └── sfx/            # menu-select, menu-confirm (TBD)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

## Scene-Flow
```
BootScene (Lädt alle Assets, Ladebalken)
  → SplashScene (Ceccaroni Artwork, Musik startet, 1.5s Pause + 2.5s Hold)
    → TitleScene (BETWEEN Artwork, "Press Any Key")
      → MenuScene (6-Dimensionen Artwork + Navigierbares Menu)
        ├── "New Run" → GameScene (Gameplay)
        │                 → GameOverScene → MenuScene
        ├── "Settings" → SettingsScene → MenuScene
        └── "Credits" → CreditsScene → MenuScene
```

## Biome-System
Jedes Biome ist ein Ordner unter `src/biomes/` mit:
- `config.ts` – Biome-spezifische Einstellungen (Name, Farbpalette, Musik-Key)
- `enemies.ts` – Biome-spezifische Gegner-Definitionen
- `mechanics.ts` – Biome-spezifische Spezial-Mechanik
- `assets.ts` – Asset-Keys für dieses Biome

Core-Systeme (Player, Combat, Loot, Input) bleiben identisch.
BiomeManager lädt das richtige Biome pro Floor.

## Datenfluss
1. GameScene startet → BiomeManager wählt Biome (aktuell nur "machine")
2. DungeonGenerator erstellt Raum-Layout mit Biome-Tiles
3. Enemies werden aus Biome-Config gespawnt
4. Player interagiert über Core-Systeme
5. Floor cleared → nächstes Biome (später: zufällig)

## Scaling
- Interne Auflösung: 1280x720 (16:9)
- Phaser Scale.FIT + CENTER_BOTH: skaliert auf jede Bildschirmgrösse
- Mobile: Landscape erzwungen (Portrait zeigt Rotate-Hinweis)
- Assets in `public/` (Vite static serving), nicht in `src/`
