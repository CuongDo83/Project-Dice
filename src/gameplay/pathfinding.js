import { fromCoordKey, toCoordKey } from '../shared/coords.js';

const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 }
];

function getNeighbors(level, current) {
  return DIRECTIONS.map((direction) => ({
    x: current.x + direction.x,
    y: current.y + direction.y
  })).filter((next) => level.walkableKeys.has(toCoordKey(next)));
}

function rebuildPath(previousByKey, endKey) {
  const path = [];
  let cursor = endKey;

  while (cursor) {
    path.unshift(fromCoordKey(cursor));
    cursor = previousByKey.get(cursor) || null;
  }

  return path;
}

export function findReachablePaths(level, start, maxDistance, canEnter) {
  const startKey = toCoordKey(start);
  const queue = [{ position: start, distance: 0 }];
  const visited = new Set([startKey]);
  const previousByKey = new Map();
  const paths = new Map();

  while (queue.length > 0) {
    const current = queue.shift();

    getNeighbors(level, current.position).forEach((neighbor) => {
      const neighborKey = toCoordKey(neighbor);

      if (visited.has(neighborKey) || !canEnter(neighbor)) {
        return;
      }

      const nextDistance = current.distance + 1;
      if (nextDistance > maxDistance) {
        return;
      }

      visited.add(neighborKey);
      previousByKey.set(neighborKey, toCoordKey(current.position));
      queue.push({ position: neighbor, distance: nextDistance });
      paths.set(neighborKey, rebuildPath(previousByKey, neighborKey));
    });
  }

  return paths;
}

export function findShortestPath(level, start, target, canEnter) {
  const targetKey = toCoordKey(target);
  const reachable = findReachablePaths(level, start, Number.MAX_SAFE_INTEGER, (position) =>
    toCoordKey(position) === targetKey ? true : canEnter(position)
  );

  return reachable.get(targetKey) || null;
}
