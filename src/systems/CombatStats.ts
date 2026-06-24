import {
  ATTACK_DAMAGE,
  ATTACK_COOLDOWN_MS,
  ATTACK_RANGE,
  ATTACK_ARC_DEG,
  ATTACK_LUNGE_SPEED,
} from '../utils/Constants';

/**
 * Mutable combat parameters for the player's melee, seeded from the base
 * constants. Boons mutate this in place and the weapon reads from it live,
 * so one instance is shared for an entire run.
 */
export class CombatStats {
  /** Damage per swing hit. */
  damage = ATTACK_DAMAGE;
  /** Minimum ms between swings. */
  cooldownMs = ATTACK_COOLDOWN_MS;
  /** Cone reach in px. */
  rangePx = ATTACK_RANGE;
  /** Cone width in degrees. */
  arcDeg = ATTACK_ARC_DEG;
  /** Forward lunge speed on swing start, px/s. */
  lungeSpeed = ATTACK_LUNGE_SPEED;
  /** HP restored per hit (fractional; the weapon accumulates and emits whole HP). */
  lifesteal = 0;
  /** Chance [0..1] for a swing hit to deal double damage. */
  critChance = 0;
  /** If > 0, every Nth swing widens to a full 360° whirlwind. */
  whirlwindEvery = 0;
}
