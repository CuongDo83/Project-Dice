import {
  DAY_NIGHT_PHASES,
  DAY_NIGHT_ROUND_LENGTH,
  NIGHT_ENEMY_MULTIPLIER,
  PHASED_WARNING_TEXT
} from '../data/day-night-config.js';

function createCycleState(phase) {
  return {
    phase,
    remainingRoundsInPhase: DAY_NIGHT_ROUND_LENGTH[phase],
    completedFullRounds: 0
  };
}

export function createDayNightCycle() {
  return createCycleState(DAY_NIGHT_PHASES.day);
}

export function isNightPhase(dayNight) {
  return dayNight?.phase === DAY_NIGHT_PHASES.night;
}

export function getPhaseWarningText(phase) {
  return PHASED_WARNING_TEXT[phase] || '';
}

export function advanceDayNightCycle(dayNight) {
  dayNight.completedFullRounds += 1;
  dayNight.remainingRoundsInPhase -= 1;

  if (dayNight.remainingRoundsInPhase > 0) {
    return {
      changed: false,
      phase: dayNight.phase,
      message: ''
    };
  }

  dayNight.phase = dayNight.phase === DAY_NIGHT_PHASES.day
    ? DAY_NIGHT_PHASES.night
    : DAY_NIGHT_PHASES.day;
  dayNight.remainingRoundsInPhase = DAY_NIGHT_ROUND_LENGTH[dayNight.phase];

  return {
    changed: true,
    phase: dayNight.phase,
    message: getPhaseWarningText(dayNight.phase)
  };
}

export function getEffectiveEnemyStats(enemy, dayNight) {
  if (!isNightPhase(dayNight)) {
    return {
      moveSpeedMin: enemy.moveSpeedMin,
      moveSpeedMax: enemy.moveSpeedMax,
      dmgMin: enemy.dmgMin,
      dmgMax: enemy.dmgMax
    };
  }

  return {
    moveSpeedMin: enemy.moveSpeedMin * NIGHT_ENEMY_MULTIPLIER.speed,
    moveSpeedMax: enemy.moveSpeedMax * NIGHT_ENEMY_MULTIPLIER.speed,
    dmgMin: enemy.dmgMin * NIGHT_ENEMY_MULTIPLIER.damage,
    dmgMax: enemy.dmgMax * NIGHT_ENEMY_MULTIPLIER.damage
  };
}
