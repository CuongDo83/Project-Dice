import { OBJECTIVES } from '../shared/constants.js';
import { toCoordKey } from '../shared/coords.js';
import { BASELINE_PLAYER_CONFIG } from '../data/player-config.js';
import { getEnemyConfig, getEnemyDisplayMeta } from '../data/enemy-config.js';
import { validateLevelDefinition } from './level-validator.js';

function buildPlayerStats(levelDefinition) {
  const authored = levelDefinition.playerStats || {};

  return {
    hp: authored.hp ?? BASELINE_PLAYER_CONFIG.hp,
    dmgMin: authored.dmgMin ?? BASELINE_PLAYER_CONFIG.dmgMin,
    dmgMax: authored.dmgMax ?? BASELINE_PLAYER_CONFIG.dmgMax,
    moveMin: authored.moveMin ?? BASELINE_PLAYER_CONFIG.moveMin,
    moveMax: authored.moveMax ?? BASELINE_PLAYER_CONFIG.moveMax
  };
}

function buildCompiledWaves(levelDefinition) {
  if (Array.isArray(levelDefinition.waves) && levelDefinition.waves.length > 0) {
    return levelDefinition.waves.map((wave, index) => ({
      id: wave.id || `wave_${index + 1}`,
      enemyPlacements: wave.enemyPlacements.map((entry) => ({
        ...entry,
        enemyLevel: Number(entry.enemyLevel || 1 + index)
      })),
      mysteryCells: wave.mysteryCells.map((cell) => ({
        id: cell.id,
        x: cell.x,
        y: cell.y,
        rewardPoolId: cell.rewardPoolId
      }))
    }));
  }

  return [
    {
      id: 'wave_legacy',
      enemyPlacements: (levelDefinition.enemyPlacements || []).map((entry) => ({
        ...entry,
        enemyLevel: Number(entry.enemyLevel || 1)
      })),
      mysteryCells: (levelDefinition.mysteryCells || []).map((cell) => ({
        id: cell.id,
        x: cell.x,
        y: cell.y,
        rewardPoolId: cell.rewardPoolId
      }))
    }
  ];
}

export function createRuntimeEnemiesFromPlacements(waveEnemyPlacements) {
  return waveEnemyPlacements.map((placement, index) => {
    const config = getEnemyConfig(placement.enemyId, placement.enemyLevel || 1);
    const displayMeta = getEnemyDisplayMeta(placement.enemyId);

    return {
      // Enemy init schema (v1.1.3)
      id: placement.instanceId || `${placement.enemyId}_${index + 1}`,
      archetype: config.archetype,
      level: config.level,
      hp: config.hp,
      dmgMin: config.dmgMin,
      dmgMax: config.dmgMax,
      moveSpeedMin: config.moveSpeedMin,
      moveSpeedMax: config.moveSpeedMax,
      // Runtime enemy schema direction (v1.1.3)
      currentHp: config.hp,
      alive: true,
      currentPosition: { ...placement.position },
      label: displayMeta.label,
      introText: displayMeta.introText,
      asset: displayMeta.asset,
      contentEntryType: placement.contentEntryType || null,
      goldBandOverride: placement.goldBandOverride || null,
      goldRewardOverride: placement.goldRewardOverride ?? null
    };
  });
}

export function generateRuntimeLevel(levelDefinition) {
  validateLevelDefinition(levelDefinition);

  const playerStats = buildPlayerStats(levelDefinition);
  const walkableKeys = new Set(levelDefinition.walkableCells.map(toCoordKey));
  const blockedKeys = new Set(levelDefinition.blockedCells.map(toCoordKey));
  const waves = buildCompiledWaves(levelDefinition);
  const firstWave = waves[0];
  const initialMysteryCells = firstWave.mysteryCells.map((cell) => ({
    id: cell.id,
    x: cell.x,
    y: cell.y,
    rewardPoolId: cell.rewardPoolId
  }));
  const initialEnemies = createRuntimeEnemiesFromPlacements(firstWave.enemyPlacements);

  return {
    id: levelDefinition.id,
    mapSize: { ...levelDefinition.mapSize },
    gridWidth: levelDefinition.mapSize.width,
    gridHeight: levelDefinition.mapSize.height,
    objective: levelDefinition.objective || { objectiveType: OBJECTIVES.defeatAll, targetValue: 'all_enemies' },
    playerStart: { ...levelDefinition.playerStart },
    playerStats,
    walkableKeys,
    blockedKeys,
    walkableCells: levelDefinition.walkableCells.map((cell) => ({ ...cell })),
    blockedCells: levelDefinition.blockedCells.map((cell) => ({ ...cell })),
    mysteryCells: initialMysteryCells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      rewardPoolId: cell.rewardPoolId,
      consumed: false
    })),
    initialMysteryCells,
    specialTiles: levelDefinition.specialTiles.map((tile) => ({ ...tile })),
    goldCells: (levelDefinition.goldCells || []).map((cell) => ({ ...cell })),
    cellAssets: { ...levelDefinition.cellAssets },
    waves,
    currentWaveIndex: 0,
    battlefieldBagSlots: Number(levelDefinition.battlefieldBagSlots || 3),
    enemyPlacements: firstWave.enemyPlacements.map((placement) => ({ ...placement })),
    enemies: initialEnemies.map((enemy) => ({ ...enemy, currentPosition: { ...enemy.currentPosition } })),
    initialEnemies
  };
}
