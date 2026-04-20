import { OBJECTIVES } from '../shared/constants.js';

export function isWaveCleared(enemies) {
  return enemies.every((enemy) => !enemy.alive || enemy.currentHp <= 0);
}

export function isObjectiveComplete(objective, enemies, hasMoreWaves = false) {
  if (!objective || objective.objectiveType === OBJECTIVES.defeatAll) {
    return !hasMoreWaves && isWaveCleared(enemies);
  }

  return false;
}
