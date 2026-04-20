export const PLAYER_VISIBLE_POWER_FORMULA = (player) => player.hp.current + player.dmg.max;
export const ENEMY_VISIBLE_POWER_FORMULA = (enemy) => enemy.currentHp + enemy.dmgMax;

export const SLIME_HP_REFERENCE = 40;
export const PLAYER_DAMAGE_MIN_RATIO = 0.5;
export const HEAL_POTION_SPAWN_CHANCE = 0.3;
export const HEAL_POTION_HEAL_AMOUNT = 10;
export const BATTLEFIELD_BAG_SLOT_COUNT = 4;

export function getPlayerDamageWidthCap(slimeHpReference = SLIME_HP_REFERENCE) {
  return Math.floor(slimeHpReference * 0.5);
}

export function getPlayerDamageBandFloor(maxDamage) {
  return Math.ceil(maxDamage * PLAYER_DAMAGE_MIN_RATIO);
}
