import { findShortestPath } from './pathfinding.js';
import { sameCoord, toCoordKey } from '../shared/coords.js';

function rollBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function buildBlockedEnemySet(enemies, activeEnemyId) {
  return new Set(
    enemies
      .filter((enemy) => enemy.id !== activeEnemyId && enemy.alive)
      .map((enemy) => toCoordKey(enemy.currentPosition))
  );
}

export function planEnemyTurn(level, enemy, player, enemies, speedOverride = null) {
  const blockedEnemyKeys = buildBlockedEnemySet(enemies, enemy.id);
  const speed = speedOverride ?? rollBetween(enemy.moveSpeedMin, enemy.moveSpeedMax);
  const path = findShortestPath(level, enemy.currentPosition, player.position, (position) => {
    return !blockedEnemyKeys.has(toCoordKey(position));
  });

  if (!path) {
    return {
      speed,
      steps: []
    };
  }

  const steps = path.slice(1, speed + 1);

  return {
    speed,
    steps,
    reachesPlayer: steps.some((step) => sameCoord(step, player.position))
  };
}
