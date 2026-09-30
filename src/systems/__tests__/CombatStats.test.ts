import { describe, it, expect, vi } from 'vitest';
import { CombatStats } from '../CombatStats';
import { BOONS, type Boon } from '../Boon';
import {
  ATTACK_DAMAGE,
  ATTACK_COOLDOWN_MS,
  ATTACK_RANGE,
  ATTACK_ARC_DEG,
  ATTACK_LUNGE_SPEED,
} from '../../utils/Constants';

// The Boon pool uses Phaser only inside rollBoons(); the individual boon
// `apply` functions are pure. Mock Phaser so importing the module never pulls
// in the real (browser-only) engine.
vi.mock('phaser', () => {
  const Shuffle = <T>(arr: T[]): T[] => arr;
  const Clamp = (v: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, v));
  return { default: { Utils: { Array: { Shuffle } }, Math: { Clamp } } };
});

/** Looks up a boon by id; fails loudly if the pool ever drops one. */
function boon(id: string): Boon {
  const found = BOONS.find((b) => b.id === id);
  if (!found) throw new Error(`boon "${id}" not found in pool`);
  return found;
}

describe('CombatStats defaults', () => {
  it('seeds every field from the base constants', () => {
    const s = new CombatStats();
    expect(s.damage).toBe(ATTACK_DAMAGE);
    expect(s.cooldownMs).toBe(ATTACK_COOLDOWN_MS);
    expect(s.rangePx).toBe(ATTACK_RANGE);
    expect(s.arcDeg).toBe(ATTACK_ARC_DEG);
    expect(s.lungeSpeed).toBe(ATTACK_LUNGE_SPEED);
    expect(s.lifesteal).toBe(0);
    expect(s.critChance).toBe(0);
    expect(s.whirlwindEvery).toBe(0);
  });
});

describe('boon.apply mutates CombatStats correctly', () => {
  it('Sharper Blade adds +3 damage', () => {
    const s = new CombatStats();
    boon('sharper').apply(s);
    expect(s.damage).toBe(ATTACK_DAMAGE + 3);
  });

  it('Long Reach adds +22 range', () => {
    const s = new CombatStats();
    boon('reach').apply(s);
    expect(s.rangePx).toBe(ATTACK_RANGE + 22);
  });

  it("Vampire's Edge adds +0.5 lifesteal and stacks", () => {
    const s = new CombatStats();
    boon('vampire').apply(s);
    expect(s.lifesteal).toBe(0.5);
    boon('vampire').apply(s);
    expect(s.lifesteal).toBe(1);
  });

  it('Momentum scales lunge speed by 1.4 (rounded)', () => {
    const s = new CombatStats();
    boon('momentum').apply(s);
    expect(s.lungeSpeed).toBe(Math.round(ATTACK_LUNGE_SPEED * 1.4));
  });

  it('Frenzy adds +2 damage and shaves 10% off cooldown', () => {
    const s = new CombatStats();
    boon('frenzy').apply(s);
    expect(s.damage).toBe(ATTACK_DAMAGE + 2);
    expect(s.cooldownMs).toBe(Math.round(ATTACK_COOLDOWN_MS * 0.9));
  });

  it('stacks two damage boons additively', () => {
    const s = new CombatStats();
    boon('sharper').apply(s);
    boon('frenzy').apply(s);
    expect(s.damage).toBe(ATTACK_DAMAGE + 3 + 2);
  });
});

describe('boon clamps and floors', () => {
  it('Swift Strikes reduces cooldown by 25% but never below 120ms', () => {
    const s = new CombatStats();
    boon('swift').apply(s);
    expect(s.cooldownMs).toBe(Math.max(120, Math.round(ATTACK_COOLDOWN_MS * 0.75)));
    for (let i = 0; i < 20; i++) boon('swift').apply(s);
    expect(s.cooldownMs).toBe(120);
  });

  it('Wide Arc adds +35 degrees but caps at 300', () => {
    const s = new CombatStats();
    boon('wide').apply(s);
    expect(s.arcDeg).toBe(ATTACK_ARC_DEG + 35);
    for (let i = 0; i < 20; i++) boon('wide').apply(s);
    expect(s.arcDeg).toBe(300);
  });

  it('Executioner adds +25% crit but caps at 100%', () => {
    const s = new CombatStats();
    boon('crit').apply(s);
    expect(s.critChance).toBeCloseTo(0.25, 10);
    for (let i = 0; i < 10; i++) boon('crit').apply(s);
    expect(s.critChance).toBe(1);
  });

  it('Whirlwind starts at every-4th then tightens toward every-2nd', () => {
    const s = new CombatStats();
    boon('whirl').apply(s);
    expect(s.whirlwindEvery).toBe(4);
    boon('whirl').apply(s);
    expect(s.whirlwindEvery).toBe(3);
    boon('whirl').apply(s);
    expect(s.whirlwindEvery).toBe(2);
    for (let i = 0; i < 5; i++) boon('whirl').apply(s);
    expect(s.whirlwindEvery).toBe(2);
  });
});
