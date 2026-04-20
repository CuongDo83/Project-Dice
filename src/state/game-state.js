import { PLAYER_VISIBLE_POWER_FORMULA, ENEMY_VISIBLE_POWER_FORMULA } from '../data/balance-config.js';
import { PHASES, SCREENS } from '../shared/constants.js';
import { applyProfileToPlayerStats } from '../persistence/save-store.js';
import { clonePosition } from '../shared/coords.js';
import { createDayNightCycle } from '../gameplay/day-night.js';
import { createBattlefieldBag } from '../gameplay/battlefield-bag.js';
import { createDefaultEquipmentRuntime } from '../gameplay/equipment.js';

function buildPlayer(runtimeLevel, profile) {
  const stats = applyProfileToPlayerStats(runtimeLevel.playerStats, profile);

  return {
    position: clonePosition(runtimeLevel.playerStart),
    base: {
      hp: stats.hp,
      dmgMin: stats.dmgMin,
      dmgMax: stats.dmgMax,
      moveMin: stats.moveMin,
      moveMax: stats.moveMax
    },
    hp: {
      current: stats.hp,
      max: stats.hp
    },
    dmg: {
      min: stats.dmgMin,
      max: stats.dmgMax
    },
    moveMin: stats.moveMin,
    moveMax: stats.moveMax,
    healEfficiency: 0,
    combatStats: {
      critChance: 0,
      critDamage: 0,
      blockChance: 0,
      lifesteal: 0,
      doubleStrike: 0,
      nightDamageTakenReduction: 0
    },
    postCombatHeal: 0
  };
}

function cloneEnemies(runtimeLevel) {
  return runtimeLevel.enemies.map((enemy) => ({
    ...enemy,
    currentPosition: clonePosition(enemy.currentPosition)
  }));
}

export function createGameState(runtimeLevel, profile, gold, seenEnemyIntros) {
  const player = buildPlayer(runtimeLevel, profile);

  return {
    screen: SCREENS.home,
    homeView: 'main',
    runMode: 'main',
    mainRuntimeLevel: runtimeLevel,
    activeRuneTrialStageId: null,
    runeTrialView: null,
    runeTrialToast: null,
    idleRewardView: null,
    phase: PHASES.home,
    runtimeLevel,
    profile,
    gold,
    runGoldBase: 0,
    seenEnemyIntros,
    player,
    enemies: cloneEnemies(runtimeLevel),
    rolledMove: null,
    reachablePaths: new Map(),
    dragPath: [],
    isDraggingPath: false,
    dragPreviewText: '',
    modal: null,
    rewardFeedback: null,
    resultText: null,
    rollAnnouncement: null,
    enemyRollPreview: null,
    enemyThreatPreviewEnabled: true,
    enemyThreatPreview: null,
    enemyTooltipEnemyId: null,
    goldTechTreeView: null,
    equipmentView: null,
    equipmentBlacksmith: null,
    equipmentToast: null,
    runResultTable: null,
    runStats: {
      enemiesKilled: 0,
      rewards: [],
      equipmentObtained: []
    },
    rewardFlyDrops: [],
    hudBagPulse: false,
    lastCombatEnemy: null,
    battlefieldBag: createBattlefieldBag(),
    equipmentRuntime: createDefaultEquipmentRuntime(),
    bagRerollRemaining: 1,
    healPotions: [],
    waveWarning: null,
    dayNight: createDayNightCycle(),
    phaseCue: '',
    currentWaveIndex: runtimeLevel.currentWaveIndex || 0,
    totalWaves: runtimeLevel.waves?.length || 1,
    message: 'Roll to choose a route.',
    turnCounter: 1
  };
}

export function resetRunState(state, options = {}) {
  const runMode = options.runMode || 'main';
  const runtimeLevel = options.runtimeLevel || (runMode === 'main' ? state.mainRuntimeLevel : state.runtimeLevel);
  state.runMode = runMode;
  state.activeRuneTrialStageId = runMode === 'runeTrial' ? Number(options.stageId || 0) : null;
  state.runtimeLevel = runtimeLevel;
  state.runtimeLevel.mysteryCells = (state.runtimeLevel.initialMysteryCells || []).map((cell) => ({
    ...cell,
    consumed: false
  }));
  state.player = buildPlayer(state.runtimeLevel, state.profile);
  state.enemies = (state.runtimeLevel.initialEnemies || state.runtimeLevel.enemies).map((enemy) => ({
    ...enemy,
    currentPosition: clonePosition(enemy.currentPosition)
  }));
  state.currentWaveIndex = 0;
  state.totalWaves = state.runtimeLevel.waves?.length || 1;
  state.battlefieldBag = createBattlefieldBag();
  state.bagRerollRemaining = 1;
  state.equipmentRuntime = createDefaultEquipmentRuntime();
  state.healPotions = [];
  state.waveWarning = null;
  state.dayNight = createDayNightCycle();
  state.phaseCue = '';
  state.screen = SCREENS.gameplay;
  state.homeView = 'main';
  state.phase = PHASES.BeforeRoll;
  state.rolledMove = null;
  state.reachablePaths = new Map();
  state.dragPath = [];
  state.isDraggingPath = false;
  state.dragPreviewText = '';
  state.modal = null;
  state.rewardFeedback = null;
  state.resultText = null;
  state.rollAnnouncement = null;
  state.enemyRollPreview = null;
  state.equipmentView = null;
  state.equipmentBlacksmith = null;
  state.equipmentToast = null;
  state.runResultTable = null;
  state.runStats = {
    enemiesKilled: 0,
    rewards: [],
    equipmentObtained: []
  };
  state.rewardFlyDrops = [];
  state.hudBagPulse = false;
  state.enemyThreatPreviewEnabled = true;
  state.enemyThreatPreview = null;
  state.enemyTooltipEnemyId = null;
  state.runGoldBase = 0;
  state.lastCombatEnemy = null;
  state.message = 'Press Roll to start the player turn.';
  state.turnCounter = 1;
}

export function getPlayerVisiblePower(player) {
  return PLAYER_VISIBLE_POWER_FORMULA(player);
}

export function getEnemyVisiblePower(enemy) {
  return ENEMY_VISIBLE_POWER_FORMULA(enemy);
}
