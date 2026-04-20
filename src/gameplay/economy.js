import {
  BOSS_GOLD_MULTIPLIER_FROM_SLIME,
  ENEMY_GOLD_BAND_BY_ARCHETYPE,
  GOLD_BANDS,
  GOLD_OVERRIDE_ENTRY_TYPES
} from '../data/gold-reward-config.js';

function getBandGold(band) {
  const key = String(band || '').toLowerCase();
  return Number(GOLD_BANDS[key] || GOLD_BANDS.mid);
}

function canApplyContentOverride(enemy) {
  const entryType = String(enemy?.contentEntryType || '').toLowerCase();
  return GOLD_OVERRIDE_ENTRY_TYPES.has(entryType);
}

/**
 * Resolve base per-kill gold before end-of-run efficiency bonus.
 */
export function resolveEnemyGoldReward(enemy) {
  if (canApplyContentOverride(enemy) && Number.isFinite(enemy?.goldRewardOverride)) {
    return Math.max(0, Math.floor(Number(enemy.goldRewardOverride)));
  }

  const entryType = String(enemy?.contentEntryType || '').toLowerCase();
  if (entryType === 'boss') {
    return GOLD_BANDS.mid * BOSS_GOLD_MULTIPLIER_FROM_SLIME;
  }

  if (canApplyContentOverride(enemy) && enemy?.goldBandOverride) {
    return getBandGold(enemy.goldBandOverride);
  }

  const baseBand = ENEMY_GOLD_BAND_BY_ARCHETYPE[enemy?.archetype] || 'mid';
  return getBandGold(baseBand);
}

/**
 * Locked v9 direction: gold efficiency applies only at end-of-run tally.
 */
export function calculateFinalRunGold(baseGoldTotal, totalGoldEfficiencyBonus) {
  const base = Math.max(0, Number(baseGoldTotal || 0));
  const bonus = Math.max(0, Number(totalGoldEfficiencyBonus || 0));
  return Math.floor(base * (1 + bonus));
}
