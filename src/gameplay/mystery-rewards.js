import { getPlayerDamageBandFloor, getPlayerDamageWidthCap } from '../data/balance-config.js';
import { MYSTERY_REWARD_RULES } from '../data/mystery-reward-config.js';
import { REWARD_TYPES } from '../shared/constants.js';

function canIncreaseMinDamage(player) {
  if (player.dmg.min === player.dmg.max) {
    return false;
  }

  const nextMin = player.dmg.min + 1;
  return nextMin <= player.dmg.max && nextMin >= getPlayerDamageBandFloor(player.dmg.max);
}

function canIncreaseMaxDamage(player, slimeHpReference) {
  const nextMax = player.dmg.max + 1;
  const nextWidth = nextMax - player.dmg.min;
  const widthCap = getPlayerDamageWidthCap(slimeHpReference);
  if (nextWidth > widthCap) {
    return false;
  }

  return player.dmg.min >= getPlayerDamageBandFloor(nextMax);
}

function chooseWeightedReward(availableRewards) {
  const entries = availableRewards
    .map((rewardType) => ({
      rewardType,
      weight: Number(MYSTERY_REWARD_RULES.odds?.[rewardType] || 0)
    }))
    .filter((entry) => entry.weight > 0);

  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }

  let roll = Math.random() * totalWeight;

  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.rewardType;
    }
  }

  return entries.at(-1)?.rewardType || null;
}

function applyMinDamageFallback(player) {
  if (player.dmg.min < player.dmg.max) {
    player.dmg.min += 1;
    return true;
  }

  return false;
}

export function resolveMysteryCell(player, slimeHpReference) {
  if (!MYSTERY_REWARD_RULES.oddsLocked || !MYSTERY_REWARD_RULES.odds) {
    return {
      applied: false,
      rewardType: null,
      message: 'Mystery reward skipped because source-of-truth odds are not locked yet.'
    };
  }

  const availableRewards = MYSTERY_REWARD_RULES.outcomes.filter((rewardType) => {
    if (rewardType === REWARD_TYPES.hp) {
      return true;
    }

    if (rewardType === REWARD_TYPES.minDamage) {
      return canIncreaseMinDamage(player);
    }

    if (rewardType === REWARD_TYPES.maxDamage) {
      return true;
    }

    return false;
  });

  if (availableRewards.length === 0) {
    return {
      applied: false,
      rewardType: null,
      message: 'Mystery reward had no valid stat upgrade to apply.'
    };
  }

  const rewardType = chooseWeightedReward(availableRewards);
  if (!rewardType) {
    return {
      applied: false,
      rewardType: null,
      message: 'Mystery reward skipped because locked odds are missing valid weights.'
    };
  }

  if (rewardType === REWARD_TYPES.hp) {
    player.hp.max += 1;
    player.hp.current += 1;
  } else if (rewardType === REWARD_TYPES.minDamage) {
    player.dmg.min += 1;
  } else if (rewardType === REWARD_TYPES.maxDamage) {
    if (canIncreaseMaxDamage(player, slimeHpReference)) {
      player.dmg.max += 1;
    } else if (applyMinDamageFallback(player)) {
      return {
        applied: true,
        rewardType: REWARD_TYPES.minDamage,
        message: 'Mystery reward overflow fallback: +1 minDamage.'
      };
    } else {
      return {
        applied: false,
        rewardType: null,
        message: 'Mystery reward overflow fallback could not apply because minDamage is already at maxDamage.'
      };
    }
  }

  return {
    applied: true,
    rewardType,
    message: `Mystery reward: +1 ${rewardType}.`
  };
}
