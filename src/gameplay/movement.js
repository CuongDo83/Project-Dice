import { findReachablePaths } from './pathfinding.js';
import { toCoordKey } from '../shared/coords.js';

export function rollMoveDistance(player) {
  return player.moveMin + Math.floor(Math.random() * (player.moveMax - player.moveMin + 1));
}

export function getReachableDestinations(level, playerPosition, rolledMove) {
  return findReachablePaths(level, playerPosition, rolledMove, () => true);
}

export function isOrthogonallyAdjacent(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

export function canExtendDraggedPath({
  level,
  playerPosition,
  currentPath,
  nextPosition,
  maxDistance
}) {
  if (!level.walkableKeys.has(toCoordKey(nextPosition))) {
    return false;
  }

  const nextLength = currentPath.length + 1;
  if (nextLength > maxDistance) {
    return false;
  }

  const anchor = currentPath.length === 0 ? playerPosition : currentPath[currentPath.length - 1];
  if (!isOrthogonallyAdjacent(anchor, nextPosition)) {
    return false;
  }

  const nextKey = toCoordKey(nextPosition);
  const visited = new Set([toCoordKey(playerPosition), ...currentPath.map(toCoordKey)]);
  return !visited.has(nextKey);
}
