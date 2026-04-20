export const DAY_NIGHT_PHASES = {
  day: 'Day',
  night: 'Night'
};

export const DAY_NIGHT_ROUND_LENGTH = {
  [DAY_NIGHT_PHASES.day]: 4,
  [DAY_NIGHT_PHASES.night]: 2
};

export const NIGHT_ENEMY_MULTIPLIER = {
  speed: 2,
  damage: 2
};

export const PHASED_WARNING_TEXT = {
  [DAY_NIGHT_PHASES.day]: 'Day phase: enemy stats back to baseline.',
  [DAY_NIGHT_PHASES.night]: 'Night phase: enemy speed x2 / atk x2.'
};
