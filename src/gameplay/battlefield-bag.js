import {
  BAG_ITEMS,
  BAG_MAX_SLOTS,
  COMBAT_CHANCE_CAP,
  FUSION_ITEMS,
  OFFER_DYNAMIC_MULTIPLIERS
} from '../data/battlefield-bag-config.js';
import { DAY_NIGHT_PHASES } from '../data/day-night-config.js';
import { getPlayerDamageWidthCap } from '../data/balance-config.js';

const ITEM_BY_ID = new Map(BAG_ITEMS.map((item) => [item.id, item]));
const FUSION_BY_ID = new Map(FUSION_ITEMS.map((item) => [item.id, item]));

function cloneEffect(effect) {
  return {
    maxHp: effect.maxHp || 0,
    dmgMin: effect.dmgMin || 0,
    dmgMax: effect.dmgMax || 0,
    minRoll: effect.minRoll || 0,
    maxRoll: effect.maxRoll || 0,
    healEfficiency: effect.healEfficiency || 0,
    critChance: effect.critChance || 0,
    critDamage: effect.critDamage || 0,
    blockChance: effect.blockChance || 0,
    lifesteal: effect.lifesteal || 0,
    doubleStrike: effect.doubleStrike || 0,
    dayDmgMin: effect.dayDmgMin || 0,
    dayDmgMax: effect.dayDmgMax || 0,
    dayMaxRoll: effect.dayMaxRoll || 0,
    dayCritChance: effect.dayCritChance || 0,
    nightDamageTakenReduction: effect.nightDamageTakenReduction || 0,
    nightDmgMin: effect.nightDmgMin || 0,
    nightDmgMax: effect.nightDmgMax || 0
  };
}

function addEffect(target, effect) {
  Object.keys(target).forEach((key) => {
    target[key] += Number(effect[key] || 0);
  });
}

function createEmptyEffect() {
  return cloneEffect({});
}

function getItemLevelEntry(item, level) {
  const safeLevel = Math.max(1, Math.min(3, level));
  return cloneEffect(item.tiers[safeLevel - 1]);
}

function getPhaseWeightBucket(progressRatio) {
  if (progressRatio < 0.34) {
    return 'early';
  }
  if (progressRatio < 0.67) {
    return 'mid';
  }
  return 'end';
}

function weightedPick(candidates) {
  const total = candidates.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= 0) {
    return null;
  }

  let roll = Math.random() * total;
  for (const entry of candidates) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.itemId;
    }
  }

  return candidates.at(-1)?.itemId || null;
}

function getPreferredFamily(bag) {
  const countByFamily = new Map();
  bag.slots.filter(Boolean).forEach((entry) => {
    const item = ITEM_BY_ID.get(entry.itemId) || FUSION_BY_ID.get(entry.itemId);
    if (!item?.family) {
      return;
    }
    countByFamily.set(item.family, (countByFamily.get(item.family) || 0) + 1);
  });

  let preferredFamily = null;
  let best = 0;
  countByFamily.forEach((value, family) => {
    if (value > best) {
      best = value;
      preferredFamily = family;
    }
  });
  return preferredFamily;
}

function recipeAlreadyFused(itemId, bag) {
  return FUSION_ITEMS.some((fusion) => {
    if (!fusion.recipe.includes(itemId)) {
      return false;
    }
    return bag.slots.some((entry) => entry?.itemId === fusion.id);
  });
}

function buildWeightedPool({ bag, hpRatio, dayNightPhase, progressRatio, allowRole }) {
  const phaseBucket = getPhaseWeightBucket(progressRatio);
  const preferredFamily = getPreferredFamily(bag);

  return BAG_ITEMS
    .filter((item) => allowRole(item))
    .map((item) => {
      const existing = bag.slots.find((entry) => entry?.itemId === item.id);
      let weight = Number(item.phaseWeight[phaseBucket] || 0);

      if (existing && existing.level < 3) {
        weight *= OFFER_DYNAMIC_MULTIPLIERS.existingNotMax;
      }
      if (preferredFamily && item.family === preferredFamily) {
        weight *= OFFER_DYNAMIC_MULTIPLIERS.familyBuildDirection;
      }
      if (
        hpRatio <= 0.5 &&
        ['Guard', 'Fortify', 'Sustain Combat', 'Sustain Utility', 'Night Guard'].includes(item.family)
      ) {
        weight *= OFFER_DYNAMIC_MULTIPLIERS.lowHpRecovery;
      }
      if (dayNightPhase === DAY_NIGHT_PHASES.day && ['sun_compass', 'sun_fang'].includes(item.id)) {
        weight *= OFFER_DYNAMIC_MULTIPLIERS.daySun;
      }
      if (dayNightPhase === DAY_NIGHT_PHASES.night && ['moon_ward', 'moon_fang'].includes(item.id)) {
        weight *= OFFER_DYNAMIC_MULTIPLIERS.nightMoon;
      }
      if (recipeAlreadyFused(item.id, bag)) {
        weight *= OFFER_DYNAMIC_MULTIPLIERS.alreadyHasFusionEndpoint;
      }

      return {
        itemId: item.id,
        weight: Math.max(0, weight)
      };
    })
    .filter((entry) => entry.weight > 0);
}

function selectSlotForItem(bag) {
  for (let index = 0; index < bag.slots.length; index += 1) {
    if (bag.slots[index] == null) {
      return index;
    }
  }

  return -1;
}

function cloneBagEntry(entry) {
  if (!entry) {
    return null;
  }
  return { ...entry };
}

export function createBattlefieldBag() {
  return {
    slots: new Array(BAG_MAX_SLOTS).fill(null),
    fusionCount: 0
  };
}

export function getBagView(bag) {
  return bag.slots.map((entry, index) => {
    if (!entry) {
      return {
        slotIndex: index,
        empty: true
      };
    }

    const item = ITEM_BY_ID.get(entry.itemId) || FUSION_BY_ID.get(entry.itemId);
    return {
      slotIndex: index,
      empty: false,
      itemId: entry.itemId,
      itemName: item?.name || entry.itemId,
      level: entry.isFusion ? null : entry.level,
      isFusion: Boolean(entry.isFusion)
    };
  });
}

export function getBagItemCatalog(itemId) {
  return ITEM_BY_ID.get(itemId) || FUSION_BY_ID.get(itemId) || null;
}

export function buildOfferChoices({ bag, playerHpRatio, dayNightPhase, progressRatio }) {
  const progressPool = buildWeightedPool({
    bag,
    hpRatio: playerHpRatio,
    dayNightPhase,
    progressRatio,
    allowRole(item) {
      return item.role === 'progress';
    }
  });
  const recoveryPool = buildWeightedPool({
    bag,
    hpRatio: playerHpRatio,
    dayNightPhase,
    progressRatio,
    allowRole(item) {
      return item.role === 'recovery';
    }
  });
  const wildcardPool = buildWeightedPool({
    bag,
    hpRatio: playerHpRatio,
    dayNightPhase,
    progressRatio,
    allowRole() {
      return true;
    }
  });

  const chosen = new Set();
  const progressChoice = weightedPick(progressPool);
  if (progressChoice) chosen.add(progressChoice);

  const recoveryChoice = weightedPick(recoveryPool.filter((entry) => !chosen.has(entry.itemId)));
  if (recoveryChoice) chosen.add(recoveryChoice);

  const wildcardChoice = weightedPick(wildcardPool.filter((entry) => !chosen.has(entry.itemId)));
  if (wildcardChoice) chosen.add(wildcardChoice);

  if (chosen.size < 3) {
    const fallbackIds = BAG_ITEMS.map((item) => item.id).filter((itemId) => !chosen.has(itemId));
    while (chosen.size < 3 && fallbackIds.length > 0) {
      const fallbackIndex = Math.floor(Math.random() * fallbackIds.length);
      chosen.add(fallbackIds.splice(fallbackIndex, 1)[0]);
    }
  }

  return [...chosen].map((itemId) => {
    const item = ITEM_BY_ID.get(itemId);
    const existing = bag.slots.find((entry) => entry?.itemId === itemId);
    return {
      itemId,
      itemName: item.name,
      family: item.family,
      role: item.role,
      nextLevel: existing ? Math.min(3, existing.level + 1) : 1
    };
  });
}

export function getOfferCardInfo({ bag, itemId }) {
  const item = ITEM_BY_ID.get(itemId);
  if (!item) {
    return null;
  }

  const existing = bag.slots.find((entry) => entry?.itemId === itemId && !entry.isFusion);
  const currentLevel = existing ? existing.level : 0;
  const nextLevel = Math.min(3, currentLevel + 1);
  const stateTag = currentLevel === 0
    ? 'New'
    : currentLevel < 3
      ? 'Upgrade'
      : 'Fusion Ready';

  const currentEffect = currentLevel > 0 ? getItemLevelEntry(item, currentLevel) : createEmptyEffect();
  const nextEffect = getItemLevelEntry(item, nextLevel);
  const affectedStats = Object.keys(nextEffect)
    .filter((key) => Number(currentEffect[key] || 0) !== Number(nextEffect[key] || 0))
    .map((key) => ({
      stat: key,
      current: Number(currentEffect[key] || 0),
      next: Number(nextEffect[key] || 0)
    }));

  const recipeRelation = FUSION_ITEMS
    .filter((fusion) => fusion.recipe.includes(itemId))
    .map((fusion) => fusion.name);

  return {
    icon: item.icon || '◆',
    itemName: item.name,
    currentLevel,
    nextLevel,
    affectedStats,
    family: item.family,
    recipeRelation: recipeRelation.length > 0 ? recipeRelation.join(', ') : 'No direct fusion recipe',
    slotImpact: 'Fits any neutral slot',
    stateTag
  };
}

export function applyOfferToBag(bag, itemId, options = {}) {
  const item = ITEM_BY_ID.get(itemId);
  if (!item) {
    return {
      applied: false,
      message: 'Unknown item.'
    };
  }

  const existingIndex = bag.slots.findIndex((entry) => entry?.itemId === itemId && !entry.isFusion);
  if (existingIndex >= 0) {
    const existing = bag.slots[existingIndex];
    if (existing.level >= 3) {
      return {
        applied: false,
        message: `${item.name} is already Lv3.`
      };
    }
    bag.slots[existingIndex] = { ...existing, level: existing.level + 1 };
    return {
      applied: true,
      message: `${item.name} upgraded to Lv${existing.level + 1}.`,
      mode: 'upgrade'
    };
  }

  const canSwapWhenNotFull = Boolean(options.allowSwapWhenNotFullForNew);
  const freeSlot = selectSlotForItem(bag);
  if (freeSlot >= 0 && !canSwapWhenNotFull) {
    bag.slots[freeSlot] = { itemId, level: 1, isFusion: false };
    return {
      applied: true,
      message: `${item.name} added to bag.`,
      mode: 'new_added'
    };
  }

  if (canSwapWhenNotFull) {
    return {
      applied: false,
      requiresSwap: true,
      allowEmptySlotSwap: true,
      message: `${item.name} is new. Choose a slot to place or swap.`
    };
  }

  return {
    applied: false,
    requiresSwap: true,
    message: `Bag is full. Pick a slot to replace with ${item.name}.`
  };
}

export function swapOfferIntoBag(bag, itemId, slotIndex) {
  const item = ITEM_BY_ID.get(itemId);
  if (!item) {
    return {
      applied: false,
      message: 'Unknown item.'
    };
  }

  if (slotIndex < 0 || slotIndex >= bag.slots.length) {
    return {
      applied: false,
      message: 'Invalid slot.'
    };
  }

  bag.slots[slotIndex] = { itemId, level: 1, isFusion: false };
  return {
    applied: true,
    message: `${item.name} stored by replacing slot ${slotIndex + 1}.`
  };
}

export function getReadyFusions(bag) {
  return FUSION_ITEMS
    .filter((fusion) => {
      if (bag.slots.some((entry) => entry?.itemId === fusion.id)) {
        return false;
      }
      return fusion.recipe.every((recipeItemId) => bag.slots.some((entry) => entry?.itemId === recipeItemId && entry.level === 3));
    })
    .map((fusion) => ({
      fusionId: fusion.id,
      name: fusion.name,
      recipe: [...fusion.recipe]
    }));
}

export function applyFusion(bag, fusionId) {
  const fusion = FUSION_BY_ID.get(fusionId);
  if (!fusion) {
    return {
      applied: false,
      message: 'Unknown fusion.'
    };
  }

  const ready = fusion.recipe.every((recipeItemId) => bag.slots.some((entry) => entry?.itemId === recipeItemId && entry.level === 3));
  if (!ready) {
    return {
      applied: false,
      message: `${fusion.name} is not ready.`
    };
  }

  fusion.recipe.forEach((recipeItemId) => {
    const index = bag.slots.findIndex((entry) => entry?.itemId === recipeItemId && entry.level === 3);
    if (index >= 0) {
      bag.slots[index] = null;
    }
  });

  const itemIndex = selectSlotForItem(bag);
  const targetIndex = itemIndex >= 0 ? itemIndex : 0;
  bag.slots[targetIndex] = { itemId: fusion.id, level: null, isFusion: true };
  bag.fusionCount += 1;

  return {
    applied: true,
    message: `${fusion.name} fused.`
  };
}

function getFusionEffect(fusion) {
  const total = createEmptyEffect();
  fusion.recipe.forEach((recipeItemId) => {
    const recipeItem = ITEM_BY_ID.get(recipeItemId);
    if (recipeItem) {
      addEffect(total, getItemLevelEntry(recipeItem, 3));
    }
  });
  addEffect(total, fusion.bonus);
  return total;
}

export function getBagTotalEffects(bag, dayNightPhase) {
  const total = createEmptyEffect();
  bag.slots.filter(Boolean).forEach((entry) => {
    if (entry.isFusion) {
      const fusion = FUSION_BY_ID.get(entry.itemId);
      if (fusion) {
        addEffect(total, getFusionEffect(fusion));
      }
      return;
    }
    const item = ITEM_BY_ID.get(entry.itemId);
    if (!item) {
      return;
    }
    addEffect(total, getItemLevelEntry(item, entry.level));
  });

  const phaseAdjusted = createEmptyEffect();
  addEffect(phaseAdjusted, total);
  const isDay = dayNightPhase === DAY_NIGHT_PHASES.day;
  const isNight = dayNightPhase === DAY_NIGHT_PHASES.night;

  // Phase-only effects are applied only in their active phase.
  if (isDay) {
    phaseAdjusted.maxRoll += total.dayMaxRoll;
    phaseAdjusted.dmgMin += total.dayDmgMin;
    phaseAdjusted.dmgMax += total.dayDmgMax;
    phaseAdjusted.critChance += total.dayCritChance;
  }

  if (isNight) {
    phaseAdjusted.dmgMin += total.nightDmgMin;
    phaseAdjusted.dmgMax += total.nightDmgMax;
  } else {
    phaseAdjusted.nightDamageTakenReduction = 0;
  }

  return phaseAdjusted;
}

export function applyDamageGuard(baseMin, baseMax, bonusMin, bonusMax, slimeHpReference) {
  let nextMin = baseMin + bonusMin;
  let nextMax = baseMax + bonusMax;

  const widthCap = getPlayerDamageWidthCap(slimeHpReference);
  if (nextMax - nextMin > widthCap) {
    const overflow = nextMax - nextMin - widthCap;
    nextMin += overflow;
  }

  if (nextMin > nextMax) {
    const overflow = nextMin - nextMax;
    nextMax += overflow;
  }

  return {
    min: nextMin,
    max: nextMax
  };
}

export function getPlayerCombatStatsFromBag(totalEffects) {
  return {
    critChance: Math.min(COMBAT_CHANCE_CAP, Math.max(0, totalEffects.critChance)),
    critDamage: Math.max(0, totalEffects.critDamage),
    blockChance: Math.min(COMBAT_CHANCE_CAP, Math.max(0, totalEffects.blockChance)),
    lifesteal: Math.max(0, totalEffects.lifesteal),
    doubleStrike: Math.min(COMBAT_CHANCE_CAP, Math.max(0, totalEffects.doubleStrike)),
    nightDamageTakenReduction: Math.max(0, totalEffects.nightDamageTakenReduction)
  };
}

export function snapshotBag(bag) {
  return {
    slots: bag.slots.map(cloneBagEntry),
    fusionCount: bag.fusionCount
  };
}
