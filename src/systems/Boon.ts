import Phaser from 'phaser';
import { CombatStats } from './CombatStats';

/** A run-modifying upgrade offered after a room clear. */
export interface Boon {
  id: string;
  name: string;
  /** Short effect description (shown on the card). */
  desc: string;
  /** Mutates the run's combat stats in place. */
  apply(stats: CombatStats): void;
}

/**
 * The boon pool. Stat boons stack; behaviour boons (whirlwind, vampire, crit)
 * create synergies when combined (e.g. swift + vampire + wide = sustain build).
 */
export const BOONS: Boon[] = [
  {
    id: 'sharper',
    name: 'Sharper Blade',
    desc: '+3 Schwertschaden',
    apply: (s) => { s.damage += 3; },
  },
  {
    id: 'swift',
    name: 'Swift Strikes',
    desc: '−25% Schwung-Cooldown',
    apply: (s) => { s.cooldownMs = Math.max(120, Math.round(s.cooldownMs * 0.75)); },
  },
  {
    id: 'reach',
    name: 'Long Reach',
    desc: '+22 Reichweite',
    apply: (s) => { s.rangePx += 22; },
  },
  {
    id: 'wide',
    name: 'Wide Arc',
    desc: '+35° Schwung-Kegel',
    apply: (s) => { s.arcDeg = Math.min(300, s.arcDeg + 35); },
  },
  {
    id: 'whirl',
    name: 'Whirlwind',
    desc: 'Jeder 4. Hieb wird zum 360°-Wirbel',
    apply: (s) => { s.whirlwindEvery = s.whirlwindEvery === 0 ? 4 : Math.max(2, s.whirlwindEvery - 1); },
  },
  {
    id: 'vampire',
    name: "Vampire's Edge",
    desc: 'Lebensraub bei Treffer',
    apply: (s) => { s.lifesteal += 0.5; },
  },
  {
    id: 'momentum',
    name: 'Momentum',
    desc: '+40% Lunge — aggressiver Vorstoss',
    apply: (s) => { s.lungeSpeed = Math.round(s.lungeSpeed * 1.4); },
  },
  {
    id: 'crit',
    name: 'Executioner',
    desc: '+25% Krit-Chance (2× Schaden)',
    apply: (s) => { s.critChance = Math.min(1, s.critChance + 0.25); },
  },
  {
    id: 'frenzy',
    name: 'Frenzy',
    desc: '+2 Schaden & −10% Cooldown',
    apply: (s) => { s.damage += 2; s.cooldownMs = Math.max(120, Math.round(s.cooldownMs * 0.9)); },
  },
];

/** Returns `count` distinct random boons for one selection. */
export function rollBoons(count: number): Boon[] {
  return Phaser.Utils.Array.Shuffle([...BOONS]).slice(0, count);
}
