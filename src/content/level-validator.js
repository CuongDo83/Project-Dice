import { isInsideGrid, toCoordKey } from '../shared/coords.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateCoordinateList(label, coordinates, gridWidth, gridHeight) {
  const seen = new Set();

  coordinates.forEach((position) => {
    assert(isInsideGrid(position, gridWidth, gridHeight), `${label} has out-of-bounds coordinate ${toCoordKey(position)}`);

    const key = toCoordKey(position);
    assert(!seen.has(key), `${label} contains duplicate coordinate ${key}`);
    seen.add(key);
  });

  return seen;
}

export function validateLevelDefinition(levelDefinition) {
  assert(levelDefinition && typeof levelDefinition === 'object', 'Level definition must be an object.');

  const requiredFields = [
    'id',
    'mapSize',
    'playerStart',
    'specialTiles',
    'objective',
    'walkableCells',
    'blockedCells',
    'cellAssets'
  ];

  requiredFields.forEach((field) => {
    assert(levelDefinition[field] !== undefined, `Missing required level field: ${field}`);
  });

  assert(levelDefinition.cellAssets.walkable, 'cellAssets.walkable must be defined.');
  assert(levelDefinition.cellAssets.blocked, 'cellAssets.blocked must be defined.');

  assert(Number.isInteger(levelDefinition.mapSize?.width), 'mapSize.width must be an integer.');
  assert(Number.isInteger(levelDefinition.mapSize?.height), 'mapSize.height must be an integer.');
  const gridWidth = levelDefinition.mapSize.width;
  const gridHeight = levelDefinition.mapSize.height;

  const walkableKeys = validateCoordinateList(
    'walkableCells',
    levelDefinition.walkableCells,
    gridWidth,
    gridHeight
  );

  const blockedKeys = validateCoordinateList(
    'blockedCells',
    levelDefinition.blockedCells,
    gridWidth,
    gridHeight
  );

  blockedKeys.forEach((key) => {
    assert(!walkableKeys.has(key), `Coordinate ${key} cannot be both walkable and blocked.`);
  });

  assert(
    isInsideGrid(levelDefinition.playerStart, gridWidth, gridHeight),
    'playerStart must be inside the grid.'
  );

  const playerKey = toCoordKey(levelDefinition.playerStart);
  assert(walkableKeys.has(playerKey), 'playerStart must be on a walkable cell.');

  const waves = Array.isArray(levelDefinition.waves) && levelDefinition.waves.length > 0
    ? levelDefinition.waves
    : [
        {
          id: 'wave_legacy',
          enemyPlacements: levelDefinition.enemyPlacements || [],
          mysteryCells: levelDefinition.mysteryCells || []
        }
      ];

  assert(waves.length > 0, 'Level must provide at least one wave.');

  waves.forEach((wave, waveIndex) => {
    assert(Array.isArray(wave.enemyPlacements), `waves[${waveIndex}].enemyPlacements must be an array.`);
    assert(Array.isArray(wave.mysteryCells), `waves[${waveIndex}].mysteryCells must be an array.`);
    assert(
      wave.mysteryCells.length >= 1,
      `waves[${waveIndex}] must contain at least 1 new mystery cell for that wave.`
    );
    const waveEnemyKeys = new Set();

    wave.enemyPlacements.forEach((enemy) => {
      assert(enemy.enemyId, `waves[${waveIndex}] enemy placement must have enemyId.`);
      assert(enemy.position, `waves[${waveIndex}] enemy ${enemy.enemyId} must have a position.`);
      assert(Number.isInteger(enemy.enemyLevel), `waves[${waveIndex}] enemy ${enemy.enemyId} must have integer enemyLevel.`);
      assert(enemy.enemyLevel >= 1, `waves[${waveIndex}] enemy ${enemy.enemyId} enemyLevel must be >= 1.`);
      assert(
        isInsideGrid(enemy.position, gridWidth, gridHeight),
        `waves[${waveIndex}] enemy ${enemy.enemyId} position must be inside the grid.`
      );

      const enemyKey = toCoordKey(enemy.position);
      assert(walkableKeys.has(enemyKey), `waves[${waveIndex}] enemy ${enemy.enemyId} must be on a walkable cell.`);
      if (waveIndex === 0) {
        assert(enemyKey !== playerKey, `waves[${waveIndex}] enemy ${enemy.enemyId} cannot overlap playerStart.`);
      }
      assert(!waveEnemyKeys.has(enemyKey), `waves[${waveIndex}] enemy placement overlap at ${enemyKey}.`);
      waveEnemyKeys.add(enemyKey);
    });

    wave.mysteryCells.forEach((cell) => {
      assert(cell.id, `waves[${waveIndex}] mystery cell must have an id.`);
      assert(typeof cell.x === 'number' && typeof cell.y === 'number', `waves[${waveIndex}] mystery cell ${cell.id} must have x and y.`);
      assert(cell.rewardPoolId, `waves[${waveIndex}] mystery cell ${cell.id} must have rewardPoolId.`);
      const position = { x: cell.x, y: cell.y };
      assert(
        isInsideGrid(position, gridWidth, gridHeight),
        `waves[${waveIndex}] mystery cell ${cell.id} must be inside the grid.`
      );

      const cellKey = toCoordKey(position);
      assert(walkableKeys.has(cellKey), `waves[${waveIndex}] mystery cell ${cell.id} must be on a walkable cell.`);
      assert(!blockedKeys.has(cellKey), `waves[${waveIndex}] mystery cell ${cell.id} cannot overlap blockedCells.`);
    });
  });

  levelDefinition.specialTiles.forEach((tile, index) => {
    assert(tile.type, `specialTiles[${index}] must have type.`);
    assert(typeof tile.x === 'number' && typeof tile.y === 'number', `specialTiles[${index}] must have x and y.`);
    assert(
      isInsideGrid({ x: tile.x, y: tile.y }, gridWidth, gridHeight),
      `specialTiles[${index}] must be inside the grid.`
    );
  });

  assert(levelDefinition.objective.objectiveType, 'objective.objectiveType must be defined.');
  assert(levelDefinition.objective.targetValue !== undefined, 'objective.targetValue must be defined.');

  return levelDefinition;
}
