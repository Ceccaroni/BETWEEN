# TICKET-001: Projekt-Setup + Boot Screens

## Ziel
Lauffähiges Phaser 3 + TypeScript + Vite Projekt mit kompletter
Ordnerstruktur, Splash Screen (Ceccaroni Games) und Title Screen (Between).

## Voraussetzungen
- Repo ist geclont und enthält CLAUDE.md, docs/, .gitignore, README.md
- LICENSE Datei muss gelöscht werden (All Rights Reserved)
- Ceccaroni Games Logo wird als PNG bereitgestellt (`ceccaroni-games.png`)

## Schritte

### 1. Aufräumen
- LICENSE Datei löschen

### 2. Vite + Phaser Setup
- `npm init -y`
- `npm install phaser`
- `npm install -D typescript vite`
- `tsconfig.json` erstellen (strict: true, target: ESNext, module: ESNext)
- `vite.config.ts` konfigurieren für Phaser
- `index.html` als Entry erstellen

### 3. Ordnerstruktur anlegen
Gemäss docs/ARCHITECTURE.md – alle Ordner erstellen:
```
src/
├── main.ts
├── scenes/
├── entities/
├── systems/
├── biomes/
│   ├── machine/
│   ├── organism/
│   ├── library/
│   ├── clockwork/
│   ├── abyss/
│   └── dream/
├── ui/
├── utils/
└── assets/
    ├── branding/
    ├── characters/
    ├── enemies/
    ├── tilesets/
    ├── ui/
    ├── effects/
    └── audio/
```

### 4. Constants
`src/utils/Constants.ts`:
- TILE_SIZE = 32
- GAME_WIDTH = 1024
- GAME_HEIGHT = 768
- PLAYER_SPEED = 200

### 5. Phaser Game Config
`src/main.ts`:
- Phaser.AUTO Renderer
- Arcade Physics
- pixelArt: true, roundPixels: true
- Scenes: [BootScene, SplashScene, TitleScene, GameScene, GameOverScene, TestScene]
- Hintergrund: Schwarz (#000000)

### 6. BootScene
`src/scenes/BootScene.ts`:
- Lädt alle initialen Assets (Ceccaroni Logo, Between Logo/Text)
- Zeigt minimalen Ladebalken
- Nach Loading → weiter zu SplashScene

### 7. SplashScene (Ceccaroni Games)
`src/scenes/SplashScene.ts`:
- Schwarzer Hintergrund
- Ceccaroni Games Logo zentriert
- Fade In (0.5s) → Hold (2s) → Fade Out (0.5s)
- Nach Fade → weiter zu TitleScene
- Beim Klick/Tastendruck: Skip zu TitleScene

### 8. TitleScene (Between)
`src/scenes/TitleScene.ts`:
- Dunkler, atmosphärischer Hintergrund (Gradient oder Partikel)
- "BETWEEN" gross, zentriert, stylisch
  - Text mit Glow-Effekt oder Tween-Animation
  - Leichtes Pulsieren/Atmen des Titels
- "Press any key to start" darunter, blinkend
- Optional: subtile Partikel im Hintergrund (Riss-Thematik)
- Bei Tastendruck → weiter zu GameScene

### 9. GameScene (Platzhalter)
`src/scenes/GameScene.ts`:
- Farbiger Hintergrund (dunkelgrau)
- Text: "The Machine - Coming Soon"
- Platzhalter für späteres Gameplay

### 10. GameOverScene (Platzhalter)
`src/scenes/GameOverScene.ts`:
- "GAME OVER" Text
- "Press R to restart"

### 11. TestScene
`src/scenes/TestScene.ts`:
- Leere Sandbox-Scene für Prototyping

## Juice ✨ (Title Screen)
- Titel "BETWEEN": Glow-Effekt, sanftes Pulsieren
- Hintergrund: Floating Partikel die langsam driften
- "Press any key": Fade-Blink-Animation
- Übergang zu GameScene: Fade-to-Black

## Akzeptanzkriterien
- [ ] LICENSE Datei gelöscht
- [ ] `npm run dev` startet ohne Fehler
- [ ] Browser zeigt: Ceccaroni Logo → Fade → Between Title Screen
- [ ] Title Screen hat Glow/Partikel-Effekte
- [ ] Tastendruck auf Title Screen → GameScene Platzhalter
- [ ] Alle Ordner aus ARCHITECTURE.md existieren
- [ ] TypeScript strict mode aktiv, keine Fehler
- [ ] Commit: `init: project setup with splash and title screen`
- [ ] Tag: `v0.0-setup`
