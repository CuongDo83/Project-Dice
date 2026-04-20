import { SAVE_SCHEMA_VERSION, STORAGE_KEYS } from '../shared/constants.js';
import { BASELINE_PLAYER_CONFIG } from '../data/player-config.js';
import {
  createDefaultGoldTechTreeSave,
  getGoldTechTreeBonuses,
  normalizeGoldTechTreeSave
} from '../data/gold-tech-tree-config.js';
import {
  createDefaultEquipmentSave,
  getEquipmentAlwaysBonuses,
  normalizeEquipmentSave
} from '../gameplay/equipment.js';
import {
  applyRuneTrialDailyReset,
  createDefaultRuneProgress,
  normalizeRuneProgress
} from '../gameplay/rune-trial.js';

function safeJsonParse(rawValue, fallbackValue) {
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn('Invalid JSON in localStorage.', error);
    return fallbackValue;
  }
}

function getDefaultProfile() {
  return {
    version: SAVE_SCHEMA_VERSION,
    hp: BASELINE_PLAYER_CONFIG.hp,
    dmgMin: BASELINE_PLAYER_CONFIG.dmgMin,
    dmgMax: BASELINE_PLAYER_CONFIG.dmgMax,
    gold: 0,
    permanentUpgrades: {
      hp: 0,
      dmgMin: 0,
      dmgMax: 0
    },
    goldTechTree: createDefaultGoldTechTreeSave(),
    equipment: createDefaultEquipmentSave(),
    runeProgress: createDefaultRuneProgress(),
    idleReward: {
      lastAccruedAt: new Date().toISOString(),
      unclaimedGold: 0,
      pendingEquipmentRolls: 0
    },
    selectedMap: 'level-001'
  };
}

function getDefaultEconomy() {
  return {
    totalGold: 0,
    earnedThisRun: 0,
    spentTotal: 0
  };
}

export function loadPlayerProfile() {
  const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEYS.playerData), null);

  if (!parsed || typeof parsed !== 'object') {
    return getDefaultProfile();
  }

  return {
    version: parsed.version ?? SAVE_SCHEMA_VERSION,
    hp: Number(parsed.hp ?? BASELINE_PLAYER_CONFIG.hp),
    dmgMin: Number(parsed.dmgMin ?? BASELINE_PLAYER_CONFIG.dmgMin),
    dmgMax: Number(parsed.dmgMax ?? BASELINE_PLAYER_CONFIG.dmgMax),
    gold: Number(parsed.gold || 0),
    permanentUpgrades: {
      hp: Number(parsed.permanentUpgrades?.hp || parsed.upgrades?.hp || 0),
      dmgMin: Number(parsed.permanentUpgrades?.dmgMin || parsed.upgrades?.dmgMin || 0),
      dmgMax: Number(parsed.permanentUpgrades?.dmgMax || parsed.upgrades?.dmgMax || 0)
    },
    goldTechTree: normalizeGoldTechTreeSave(parsed.goldTechTree),
    equipment: normalizeEquipmentSave(parsed.equipment),
    runeProgress: applyRuneTrialDailyReset(normalizeRuneProgress(parsed.runeProgress)),
    idleReward: {
      lastAccruedAt: parsed.idleReward?.lastAccruedAt || new Date().toISOString(),
      unclaimedGold: Math.max(0, Number(parsed.idleReward?.unclaimedGold || 0)),
      pendingEquipmentRolls: Math.max(0, Math.floor(Number(parsed.idleReward?.pendingEquipmentRolls || 0)))
    },
    selectedMap: parsed.selectedMap || 'level-001'
  };
}

export function savePlayerProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.playerData, JSON.stringify(profile));
}

export function loadEconomy() {
  const rawValue = localStorage.getItem(STORAGE_KEYS.totalGold);
  if (!rawValue) {
    return getDefaultEconomy();
  }

  // Backward compatibility: older builds stored this key as scalar total gold.
  if (!rawValue.trim().startsWith('{')) {
    return {
      ...getDefaultEconomy(),
      totalGold: Number(rawValue || 0)
    };
  }

  const parsed = safeJsonParse(rawValue, getDefaultEconomy());
  return {
    totalGold: Number(parsed.totalGold || 0),
    earnedThisRun: Number(parsed.earnedThisRun || 0),
    spentTotal: Number(parsed.spentTotal || 0)
  };
}

export function saveEconomy(economy) {
  localStorage.setItem(STORAGE_KEYS.totalGold, JSON.stringify(economy));
}

export function loadTotalGold() {
  return loadEconomy().totalGold;
}

export function saveTotalGold(amount) {
  const current = loadEconomy();
  saveEconomy({
    ...current,
    totalGold: Number(amount || 0)
  });
}

export function loadSeenEnemyIntros() {
  const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEYS.enemyIntroSeen), []);
  return new Set(Array.isArray(parsed) ? parsed : []);
}

export function saveSeenEnemyIntros(seenArchetypes) {
  localStorage.setItem(STORAGE_KEYS.enemyIntroSeen, JSON.stringify([...seenArchetypes]));
}

export function loadPlaytestMapPayload() {
  return localStorage.getItem(STORAGE_KEYS.playtestMap);
}

export function applyProfileToPlayerStats(playerStats, profile) {
  const treeBonuses = getGoldTechTreeBonuses(profile.goldTechTree);
  const equipmentBonuses = getEquipmentAlwaysBonuses(profile.equipment);
  const equippedBaseHp = Number(profile.hp ?? playerStats.hp);
  const equippedBaseMin = Number(profile.dmgMin ?? playerStats.dmgMin);
  const equippedBaseMax = Number(profile.dmgMax ?? playerStats.dmgMax);
  const hpBonus = (profile.permanentUpgrades.hp || 0) + treeBonuses.hp + equipmentBonuses.maxHp;
  const minDamageBonus = (profile.permanentUpgrades.dmgMin || 0) + treeBonuses.dmgMin + equipmentBonuses.dmgMin;
  const maxDamageBonus = (profile.permanentUpgrades.dmgMax || 0) + treeBonuses.dmgMax + equipmentBonuses.dmgMax;

  return {
    hp: equippedBaseHp + hpBonus,
    dmgMin: equippedBaseMin + minDamageBonus,
    dmgMax: equippedBaseMax + maxDamageBonus,
    moveMin: playerStats.moveMin,
    moveMax: playerStats.moveMax
  };
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEYS.playerData);
  localStorage.removeItem(STORAGE_KEYS.totalGold);
  localStorage.removeItem(STORAGE_KEYS.enemyIntroSeen);
  localStorage.removeItem(STORAGE_KEYS.playtestMap);
}
