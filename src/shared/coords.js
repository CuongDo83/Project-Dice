export function toCoordKey(position) {
  return `${position.x},${position.y}`;
}

export function fromCoordKey(key) {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

export function sameCoord(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function isInsideGrid(position, gridWidth, gridHeight) {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < gridWidth &&
    position.y < gridHeight
  );
}

export function clonePosition(position) {
  return { x: position.x, y: position.y };
}
