# ARCHITECTURE.md – Between

## Übersicht
Multi-Biome Roguelike. Core-Systeme sind biome-agnostisch.
Jedes Biome liefert eigene Tiles, Enemies, Mechaniken.
6 Dimensionen, Start mit "The Machine".

## Projektstruktur
```
between/
├── CLAUDE.md                   # Regeln für Claude Code
├── docs/
│   ├── STATUS.md               # Aktueller Stand
│   ├── ARCHITECTURE.md         # Dieses Dokument
│   ├── DECISIONS.md            # Architektur-Entscheide
│   └── LORE.md                 # Spielwelt, Story, Dimensionen
├── src/
│   ├── main.ts                 # Phaser Game Config, Entry Point
│   ├── scenes/
│   │   ├── SplashScene.ts      # Ceccaroni Games Logo
│   │   ├── BootScene.ts        # Asset Loading
│   │   ├── TitleScene.ts       # "Between" Titelscreen
│   │   ├── GameScene.ts        # Haupt-Gameplay
│   │   ├── GameOverScene.ts    # Death Screen
│   │   └── TestScene.ts        # Sandbox für neue Features
│   ├── entities/
│   │   ├── Player.ts           # Spieler-Klasse
│   │   ├── Enemy.ts            # Basis-Enemy
│   │   └── Projectile.ts       # Geschosse
│   ├── systems/
│   │   ├── InputSystem.ts      # Tastatur/Gamepad
│   │   ├── CombatSystem.ts     # Damage, Health, Death
│   │   ├── DungeonGenerator.ts # Procedurale Raum-Generierung
│   │   ├── LootSystem.ts       # Item Drops
│   │   └── BiomeManager.ts     # Biome-Loading und -Switching
│   ├── biomes/
│   │   ├── machine/            # Dimension 1: The Machine
│   │   ├── organism/           # Dimension 2: The Organism
│   │   ├── library/            # Dimension 3: The Library
│   │   ├── clockwork/          # Dimension 4: The Clockwork
│   │   ├── abyss/              # Dimension 5: The Abyss
│   │   └── dream/              # Dimension 6: The Dream
│   ├── ui/
│   │   ├── HUD.ts              # Health, Minimap, Items
│   │   └── InventoryUI.ts      # Inventar-Overlay
│   ├── utils/
│   │   ├── Constants.ts        # Game Config, Tile Size etc.
│   │   └── Types.ts            # Shared TypeScript Types
│   └── assets/
│       ├── branding/           # Ceccaroni Games Logo, Between Logo
│       ├── characters/         # Player + NPC Sprites
│       ├── enemies/            # Enemy Sprites pro Biome
│       ├── tilesets/           # Tileset PNGs pro Biome
│       ├── ui/                 # UI Elemente
│       ├── effects/            # Partikel, Shader
│       └── audio/              # Sounds, Musik
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

## Scene-Flow
```
SplashScene (Ceccaroni Games Logo, 2s)
  → BootScene (Lädt alle Assets, Ladebalken)
    → TitleScene ("Between" Titel, Press Start)
      → GameScene (Gameplay)
        → GameOverScene (Death → zurück zu TitleScene)
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
