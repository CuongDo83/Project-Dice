import { createRuntimeEnemiesFromPlacements } from '../content/level-generator.js';
import {
  RUNE_TRIAL_DAILY_REWARDED_WINS,
  RUNE_TRIAL_RESET_HOUR,
  RUNE_TRIAL_SAMPLE_STAGE_IDS,
  RUNE_TRIAL_SAMPLE_STAGES,
  RUNE_TRIAL_STAGE_REWARD_BY_STAGE,
  getRuneTrialStageReward
} from '../data/rune-trial-config.js';
import { OBJECTIVES } from '../shared/constants.js';
import { toCoordKey } from '../shared/coords.js';

function toMs(value) {
  const ms = Number(value);
  return Number.isFinite(ms) ? ms : Date.now();
}

function toStageKey(stageId) {
  return String(Number(stageId || 0));
}

function createDefaultStageClearMap() {
  const map = {};
  Object.keys(RUNE_TRIAL_STAGE_REWARD_BY_STAGE).forEach((stageId) => {
    map[stageId] = false;
  });
  return map;
}

export function createDefaultRuneProgress() {
  return {
    runeShardBalance: 0,
    highestClearedStage: 0,
    stageClearMap: createDefaultStageClearMap(),
    dailyRewardedWinsUsed: 0,
    lastDailyResetAt: null
  };
}

function getDailyResetAnchorMs(nowMs) {
  const date = new Date(toMs(nowMs));
  const anchor = new Date(date);
  anchor.setHours(RUNE_TRIAL_RESET_HOUR, 0, 0, 0);
  if (date.getTime() < anchor.getTime()) {
    anchor.setDate(anchor.getDate() - 1);
  }
  return anchor.getTime();
}

export function normalizeRuneProgress(rawProgress) {
  const defaults = createDefaultRuneProgress();
  if (!rawProgress || typeof rawProgress !== 'object') {
    return defaults;
  }
  const stageClearMap = createDefaultStageClearMap();
  Object.keys(stageClearMap).forEach((stageId) => {
    stageClearMap[stageId] = Boolean(rawProgress.stageClearMap?.[stageId]);
  });
  return {
    runeShardBalance: Math.max(0, Number(rawProgress.runeShardBalance || 0)),
    highestClearedStage: Math.max(0, Number(rawProgress.highestClearedStage || 0)),
    stageClearMap,
    dailyRewardedWinsUsed: Math.max(0, Math.min(RUNE_TRIAL_DAILY_REWARDED_WINS, Number(rawProgress.dailyRewardedWinsUsed || 0))),
    lastDailyResetAt: rawProgress.lastDailyResetAt || null
  };
}

export function applyRuneTrialDailyReset(progress, nowMs = Date.now()) {
  const normalized = normalizeRuneProgress(progress);
  const anchorMs = getDailyResetAnchorMs(nowMs);
  const lastResetMs = normalized.lastDailyResetAt ? Date.parse(normalized.lastDailyResetAt) : NaN;
  if (Number.isFinite(lastResetMs) && lastResetMs >= anchorMs) {
    return normalized;
  }
  return {
    ...normalized,
    dailyRewardedWinsUsed: 0,
    lastDailyResetAt: new Date(anchorMs).toISOString()
  };
}

export function getRuneTrialRemainingRewardedWins(progress) {
  const normalized = normalizeRuneProgress(progress);
  return Math.max(0, RUNE_TRIAL_DAILY_REWARDED_WINS - normalized.dailyRewardedWinsUsed);
}

export function getRuneTrialSampleStageIds() {
  return [...RUNE_TRIAL_SAMPLE_STAGE_IDS];
}

export function getRuneTrialStageDefinition(stageId) {
  return RUNE_TRIAL_SAMPLE_STAGES[Number(stageId)] || null;
}

export function isRuneTrialStageUnlocked(progress, stageId) {
  const normalized = normalizeRuneProgress(progress);
  const numeric = Number(stageId || 0);
  return numeric === 1 || numeric <= normalized.highestClearedStage + 1;
}

export function isRuneTrialStageCleared(progress, stageId) {
  const normalized = normalizeRuneProgress(progress);
  return Boolean(normalized.stageClearMap?.[toStageKey(stageId)]);
}

export function canSweepRuneTrialStage(progress, stageId) {
  const normalized = normalizeRuneProgress(progress);
  const numeric = Number(stageId || 0);
  if (!isRuneTrialStageCleared(normalized, numeric)) {
    return false;
  }
  return true;
}

export function buildRuneTrialStageListView(progress) {
  const normalized = normalizeRuneProgress(progress);
  return getRuneTrialSampleStageIds().map((stageId) => ({
    stageId,
    reward: getRuneTrialStageReward(stageId),
    unlocked: isRuneTrialStageUnlocked(normalized, stageId),
    cleared: isRuneTrialStageCleared(normalized, stageId),
    canSweep: canSweepRuneTrialStage(normalized, stageId)
  }));
}

function buildWalkableCells(mapSize, blockedCells) {
  const blocked = new Set(blockedCells.map((cell) => toCoordKey(cell)));
  const walkable = [];
  for (let y = 0; y < mapSize.height; y += 1) {
    for (let x = 0; x < mapSize.width; x += 1) {
      const key = toCoordKey({ x, y });
      if (!blocked.has(key)) {
        walkable.push({ x, y });
      }
    }
  }
  return walkable;
}

export function buildRuneTrialRuntimeLevel(stageDefinition, playerStats) {
  const blockedCells = (stageDefinition.blockedCells || []).map((cell) => ({ ...cell }));
  const walkableCells = buildWalkableCells(stageDefinition.mapSize, blockedCells);
  const walkableKeys = new Set(walkableCells.map((cell) => toCoordKey(cell)));
  const blockedKeys = new Set(blockedCells.map((cell) => toCoordKey(cell)));
  const waves = (stageDefinition.waves || []).map((wave, index) => ({
    id: `rune_trial_wave_${stageDefinition.id}_${index + 1}`,
    enemyPlacements: wave.enemyPlacements.map((placement) => ({ ...placement })),
    mysteryCells: []
  }));
  const firstWave = waves[0] || { enemyPlacements: [] };
  const initialEnemies = createRuntimeEnemiesFromPlacements(firstWave.enemyPlacements);

  return {
    id: `rune_trial_stage_${stageDefinition.id}`,
    mapSize: { ...stageDefinition.mapSize },
    gridWidth: stageDefinition.mapSize.width,
    gridHeight: stageDefinition.mapSize.height,
    objective: { objectiveType: OBJECTIVES.defeatAll, targetValue: 'all_enemies' },
    playerStart: { ...stageDefinition.playerStart },
    playerStats: {
      hp: Number(playerStats.hp || 0),
      dmgMin: Number(playerStats.dmgMin || 0),
      dmgMax: Number(playerStats.dmgMax || 0),
      moveMin: Number(playerStats.moveMin || 1),
      moveMax: Number(playerStats.moveMax || 3)
    },
    walkableKeys,
    blockedKeys,
    walkableCells,
    blockedCells,
    mysteryCells: [],
    initialMysteryCells: [],
    specialTiles: [],
    goldCells: [],
    cellAssets: {
      walkable: 'floor_basic',
      blocked: 'wall_basic'
    },
    waves,
    currentWaveIndex: 0,
    battlefieldBagSlots: 0,
    enemyPlacements: firstWave.enemyPlacements.map((placement) => ({ ...placement })),
    enemies: initialEnemies.map((enemy) => ({ ...enemy, currentPosition: { ...enemy.currentPosition } })),
    initialEnemies
  };
}

export function applyRuneTrialWin(progress, stageId) {
  const normalized = normalizeRuneProgress(progress);
  const stageKey = toStageKey(stageId);
  const reward = getRuneTrialStageReward(stageId);
  const canConsumeRewardedWin = getRuneTrialRemainingRewardedWins(normalized) > 0;
  if (!canConsumeRewardedWin) {
    return {
      nextProgress: normalized,
      rewarded: false,
      reward: 0
    };
  }
  return {
    nextProgress: {
      ...normalized,
      runeShardBalance: normalized.runeShardBalance + reward,
      highestClearedStage: Math.max(normalized.highestClearedStage, Number(stageId || 0)),
      stageClearMap: {
        ...normalized.stageClearMap,
        [stageKey]: true
      },
      dailyRewardedWinsUsed: normalized.dailyRewardedWinsUsed + 1
    },
    rewarded: true,
    reward
  };
}

export function applyRuneTrialSweep(progress, stageId) {
  const normalized = normalizeRuneProgress(progress);
  if (!canSweepRuneTrialStage(normalized, stageId)) {
    return {
      ok: false,
      reason: 'invalid_stage',
      nextProgress: normalized
    };
  }
  if (getRuneTrialRemainingRewardedWins(normalized) <= 0) {
    return {
      ok: false,
      reason: 'daily_limit',
      nextProgress: normalized
    };
  }
  const reward = getRuneTrialStageReward(stageId);
  return {
    ok: true,
    reward,
    nextProgress: {
      ...normalized,
      runeShardBalance: normalized.runeShardBalance + reward,
      dailyRewardedWinsUsed: normalized.dailyRewardedWinsUsed + 1
    }
  };
}
