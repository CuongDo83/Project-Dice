export const GOLD_BANDS = {
  low: 1,
  mid: 2,
  high: 4
};

export const ENEMY_GOLD_BAND_BY_ARCHETYPE = {
  enemy_wind: 'low',
  enemy_slime: 'mid',
  enemy_worm: 'high',
  enemy_fire: 'high'
};

export const GOLD_OVERRIDE_ENTRY_TYPES = new Set([
  'elite',
  'boss',
  'chapter_milestone'
]);

export const BOSS_GOLD_MULTIPLIER_FROM_SLIME = 8;
