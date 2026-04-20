import {
  EQUIPMENT_FAMILY_ICONS,
  EQUIPMENT_FAMILY_LABELS,
  EQUIPMENT_LINE_EFFECTS_BY_FAMILY,
  EQUIPMENT_MERGE_COST_BY_FROM_TIER,
  EQUIPMENT_MERGE_REQUIREMENTS_BY_FROM_TIER,
  EQUIPMENT_PIECE_TEMPLATES,
  EQUIPMENT_SCHEMA_VERSION,
  EQUIPMENT_SLOT_ICONS,
  EQUIPMENT_SLOT_LABELS,
  EQUIPMENT_SLOT_ORDER,
  EQUIPMENT_SLOT_UPGRADE_COST_BY_LEVEL,
  EQUIPMENT_SLOT_UPGRADE_GROWTH,
  EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL,
  EQUIPMENT_STARTER_PIECE_BLUEPRINTS,
  EQUIPMENT_TIER2_BONUS_BY_SLOT,
  EQUIPMENT_TIER_MAX
} from '../data/equipment-config.js';

const PIECE_TEMPLATE_BY_ID = new Map(EQUIPMENT_PIECE_TEMPLATES.map((entry) => [entry.templateId, entry]));
const SLOT_SORT_INDEX = new Map(EQUIPMENT_SLOT_ORDER.map((slot, index) => [slot, index]));
const CONDITION_LABELS = {
  always: 'Always',
  first_hit: 'First hit each combat',
  enemy_below_half: 'Enemy < 50% HP',
  night: 'Night',
  after_win: 'After winning combat',
  after_win_next_combat: 'After winning combat (next combat)'
};
const STAT_LABELS = {
  maxHp: 'Max HP',
  dmgMin: 'Min DMG',
  dmgMax: 'Max DMG',
  blockChance: 'Block Chance',
  doubleStrike: 'Double Strike',
  lifesteal: 'Lifesteal',
  postCombatHeal: 'Post-combat heal',
  nightDamageTakenReduction: 'Night damage reduction'
};

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createEmptyStats() {
  return {
    maxHp: 0,
    dmgMin: 0,
    dmgMax: 0,
    blockChance: 0,
    doubleStrike: 0,
    lifesteal: 0,
    postCombatHeal: 0,
    nightDamageTakenReduction: 0
  };
}

function cloneStats(stats) {
  return {
    maxHp: asNumber(stats?.maxHp, 0),
    dmgMin: asNumber(stats?.dmgMin, 0),
    dmgMax: asNumber(stats?.dmgMax, 0),
    blockChance: asNumber(stats?.blockChance, 0),
    doubleStrike: asNumber(stats?.doubleStrike, 0),
    lifesteal: asNumber(stats?.lifesteal, 0),
    postCombatHeal: asNumber(stats?.postCombatHeal, 0),
    nightDamageTakenReduction: asNumber(stats?.nightDamageTakenReduction, 0)
  };
}

function mergeStats(target, source) {
  Object.keys(target).forEach((key) => {
    target[key] += asNumber(source?.[key], 0);
  });
}

function normalizeTier(value) {
  return Math.max(1, Math.min(EQUIPMENT_TIER_MAX, asNumber(value, 1)));
}

function normalizeSlot(slot) {
  return EQUIPMENT_SLOT_ORDER.includes(slot) ? slot : null;
}

function normalizeFamily(family) {
  return Object.prototype.hasOwnProperty.call(EQUIPMENT_FAMILY_LABELS, family)
    ? family
    : 'stability';
}

function createRuntimePieceName(template, fallbackId) {
  return template?.name || fallbackId || 'Equipment Piece';
}

function createPieceFromTemplate(templateId, pieceId, tier, createdAt) {
  const template = PIECE_TEMPLATE_BY_ID.get(templateId);
  const slot = normalizeSlot(template?.slot) || EQUIPMENT_SLOT_ORDER[0];
  const family = normalizeFamily(template?.family);
  return {
    id: pieceId,
    templateId,
    slot,
    family,
    name: createRuntimePieceName(template, templateId),
    tier: normalizeTier(tier),
    createdAt
  };
}

function createEmptySlotUpgrades() {
  return {
    weapon: 1,
    auxiliary: 1,
    helmet: 1,
    armor: 1
  };
}

function createDefaultStarterPieces() {
  const now = Date.now();
  return EQUIPMENT_STARTER_PIECE_BLUEPRINTS.map((entry, index) => {
    const pieceId = `eq_piece_${index + 1}`;
    return createPieceFromTemplate(entry.templateId, pieceId, entry.tier || 1, now + index);
  });
}

function createDefaultEquippedBySlot(ownedPieces) {
  const equippedBySlot = {};
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    const starter = ownedPieces.find((piece) => piece.slot === slot);
    equippedBySlot[slot] = starter?.id || null;
  });
  return equippedBySlot;
}

function readBlueprintStarterEquips(ownedPieces) {
  const result = {};
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    result[slot] = null;
  });
  EQUIPMENT_STARTER_PIECE_BLUEPRINTS.forEach((blueprint, index) => {
    if (!blueprint.equipped) {
      return;
    }
    const piece = ownedPieces[index];
    if (!piece) {
      return;
    }
    if (!piece.slot || !EQUIPMENT_SLOT_ORDER.includes(piece.slot)) {
      return;
    }
    result[piece.slot] = piece.id;
  });
  return result;
}

export function createDefaultEquipmentSave() {
  const ownedPieces = createDefaultStarterPieces();
  const equippedFromBlueprint = readBlueprintStarterEquips(ownedPieces);
  const fallbackEquipped = createDefaultEquippedBySlot(ownedPieces);
  const equippedBySlot = {};
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    equippedBySlot[slot] = equippedFromBlueprint[slot] || fallbackEquipped[slot] || null;
  });
  return {
    version: EQUIPMENT_SCHEMA_VERSION,
    slotUpgrades: createEmptySlotUpgrades(),
    ownedPieces,
    equippedBySlot
  };
}

function normalizeOwnedPieces(rawOwnedPieces) {
  if (!Array.isArray(rawOwnedPieces) || rawOwnedPieces.length === 0) {
    return createDefaultEquipmentSave().ownedPieces;
  }
  return rawOwnedPieces.map((rawPiece, index) => {
    const fallbackTemplate = PIECE_TEMPLATE_BY_ID.get(rawPiece?.templateId) ? rawPiece.templateId : EQUIPMENT_PIECE_TEMPLATES[0].templateId;
    return createPieceFromTemplate(
      fallbackTemplate,
      String(rawPiece?.id || `eq_piece_${index + 1}`),
      rawPiece?.tier ?? 1,
      asNumber(rawPiece?.createdAt, Date.now() + index)
    );
  });
}

function normalizeSlotUpgrades(rawSlotUpgrades) {
  const next = createEmptySlotUpgrades();
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    next[slot] = Math.max(1, Math.min(EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL, asNumber(rawSlotUpgrades?.[slot], 1)));
  });
  return next;
}

function normalizeEquippedBySlot(rawEquippedBySlot, ownedPieces) {
  const next = {};
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    const candidate = rawEquippedBySlot?.[slot];
    const piece = ownedPieces.find((entry) => entry.id === candidate && entry.slot === slot);
    next[slot] = piece?.id || null;
  });
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    if (next[slot]) {
      return;
    }
    const fallback = ownedPieces.find((piece) => piece.slot === slot);
    next[slot] = fallback?.id || null;
  });
  return next;
}

export function normalizeEquipmentSave(rawSave) {
  const fallback = createDefaultEquipmentSave();
  if (!rawSave || typeof rawSave !== 'object') {
    return fallback;
  }
  const ownedPieces = normalizeOwnedPieces(rawSave.ownedPieces);
  return {
    version: asNumber(rawSave.version, EQUIPMENT_SCHEMA_VERSION),
    slotUpgrades: normalizeSlotUpgrades(rawSave.slotUpgrades),
    ownedPieces,
    equippedBySlot: normalizeEquippedBySlot(rawSave.equippedBySlot, ownedPieces)
  };
}

export function getOwnedPieceById(equipmentSave, pieceId) {
  return equipmentSave?.ownedPieces?.find((piece) => piece.id === pieceId) || null;
}

export function getEquippedPieceBySlot(equipmentSave, slot) {
  const pieceId = equipmentSave?.equippedBySlot?.[slot];
  if (!pieceId) {
    return null;
  }
  return getOwnedPieceById(equipmentSave, pieceId);
}

function getTierUnlockLineCount(tier) {
  if (tier <= 2) {
    return 0;
  }
  return Math.max(0, Math.min(4, tier - 2));
}

function getTier2Effects(slot) {
  return (EQUIPMENT_TIER2_BONUS_BY_SLOT[slot] || []).map((entry) => ({
    condition: entry.condition,
    stat: entry.stat,
    value: entry.value
  }));
}

function getLineEffects(piece, lineIndex) {
  const familyTable = EQUIPMENT_LINE_EFFECTS_BY_FAMILY[piece.family];
  const lineTable = familyTable?.[lineIndex];
  const effects = lineTable?.[piece.slot] || [];
  return effects.map((entry) => ({
    condition: entry.condition,
    stat: entry.stat,
    value: entry.value
  }));
}

export function getPieceMergeEffects(piece) {
  const effects = [];
  if (!piece || piece.tier <= 1) {
    return effects;
  }
  if (piece.tier >= 2) {
    effects.push(...getTier2Effects(piece.slot));
  }
  const unlockedLines = getTierUnlockLineCount(piece.tier);
  for (let lineIndex = 1; lineIndex <= unlockedLines; lineIndex += 1) {
    effects.push(...getLineEffects(piece, lineIndex));
  }
  return effects;
}

function isEffectActive(effect, context) {
  if (!effect) {
    return false;
  }
  switch (effect.condition) {
    case 'always':
      return context?.includeAlways !== false;
    case 'night':
      return Boolean(context?.isNight);
    case 'first_hit':
      return Boolean(context?.isFirstHit);
    case 'enemy_below_half':
      return Boolean(context?.enemyBelowHalf);
    case 'after_win':
      return Boolean(context?.justWonCombat);
    case 'after_win_next_combat':
      return Boolean(context?.afterWinNextCombatActive);
    default:
      return false;
  }
}

function applyEffectToStats(effect, targetStats, context) {
  if (!isEffectActive(effect, context)) {
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(targetStats, effect.stat)) {
    return;
  }
  targetStats[effect.stat] += asNumber(effect.value, 0);
}

export function getSlotUpgradeBonusBySlotLevel(slot, level) {
  const growth = EQUIPMENT_SLOT_UPGRADE_GROWTH[slot] || {};
  const scalar = Math.max(0, asNumber(level, 1));
  return {
    maxHp: asNumber(growth.maxHp, 0) * scalar,
    dmgMin: asNumber(growth.dmgMin, 0) * scalar,
    dmgMax: asNumber(growth.dmgMax, 0) * scalar
  };
}

export function getEquipmentSlotUpgradeBonuses(equipmentSave) {
  const stats = createEmptyStats();
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    if (!equipmentSave?.equippedBySlot?.[slot]) {
      return;
    }
    const level = asNumber(equipmentSave?.slotUpgrades?.[slot], 1);
    mergeStats(stats, getSlotUpgradeBonusBySlotLevel(slot, level));
  });
  return stats;
}

export function getEquipmentAlwaysBonuses(equipmentSave, { isNight = false } = {}) {
  const stats = createEmptyStats();
  mergeStats(stats, getEquipmentSlotUpgradeBonuses(equipmentSave));
  (equipmentSave?.ownedPieces || []).forEach((piece) => {
    if (equipmentSave?.equippedBySlot?.[piece.slot] !== piece.id) {
      return;
    }
    const effects = getPieceMergeEffects(piece);
    effects.forEach((effect) => {
      applyEffectToStats(effect, stats, {
        isNight,
        includeAlways: true,
        justWonCombat: false,
        afterWinNextCombatActive: false,
        isFirstHit: false,
        enemyBelowHalf: false
      });
    });
  });
  return stats;
}

function getEquippedPieces(equipmentSave) {
  const pieces = [];
  EQUIPMENT_SLOT_ORDER.forEach((slot) => {
    const piece = getEquippedPieceBySlot(equipmentSave, slot);
    if (piece) {
      pieces.push(piece);
    }
  });
  return pieces;
}

export function getEquipmentCombatStats(equipmentSave, runtimeFlags = {}) {
  const stats = createEmptyStats();
  const pieces = getEquippedPieces(equipmentSave);
  pieces.forEach((piece) => {
    const effects = getPieceMergeEffects(piece);
    effects.forEach((effect) => {
      applyEffectToStats(effect, stats, {
        isNight: Boolean(runtimeFlags.isNight),
        includeAlways: false,
        justWonCombat: false,
        afterWinNextCombatActive: Boolean(runtimeFlags.afterWinNextCombatActive),
        isFirstHit: false,
        enemyBelowHalf: false
      });
    });
  });
  return stats;
}

export function getEquipmentAttackModifiersForStrike(equipmentSave, runtimeFlags = {}) {
  const stats = createEmptyStats();
  const pieces = getEquippedPieces(equipmentSave);
  pieces.forEach((piece) => {
    const effects = getPieceMergeEffects(piece);
    effects.forEach((effect) => {
      applyEffectToStats(effect, stats, {
        isNight: Boolean(runtimeFlags.isNight),
        includeAlways: false,
        justWonCombat: false,
        afterWinNextCombatActive: Boolean(runtimeFlags.afterWinNextCombatActive),
        isFirstHit: Boolean(runtimeFlags.isFirstHit),
        enemyBelowHalf: Boolean(runtimeFlags.enemyBelowHalf)
      });
    });
  });
  return stats;
}

export function getEquipmentPostCombatBonuses(equipmentSave, runtimeFlags = {}) {
  const stats = createEmptyStats();
  const pieces = getEquippedPieces(equipmentSave);
  pieces.forEach((piece) => {
    const effects = getPieceMergeEffects(piece);
    effects.forEach((effect) => {
      applyEffectToStats(effect, stats, {
        isNight: Boolean(runtimeFlags.isNight),
        includeAlways: true,
        justWonCombat: Boolean(runtimeFlags.justWonCombat),
        afterWinNextCombatActive: false,
        isFirstHit: false,
        enemyBelowHalf: false
      });
    });
  });
  return stats;
}

export function getSlotUpgradeNextCost(slotLevel) {
  const nextLevel = Math.max(2, Math.min(EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL, asNumber(slotLevel, 1) + 1));
  return asNumber(EQUIPMENT_SLOT_UPGRADE_COST_BY_LEVEL[nextLevel], 0);
}

export function buildSlotUpgradePreview(slot, level) {
  const currentLevel = Math.max(1, Math.min(EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL, asNumber(level, 1)));
  const nextLevel = Math.min(EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL, currentLevel + 1);
  const currentBonus = getSlotUpgradeBonusBySlotLevel(slot, currentLevel);
  const nextBonus = getSlotUpgradeBonusBySlotLevel(slot, nextLevel);
  return {
    slot,
    slotLabel: EQUIPMENT_SLOT_LABELS[slot],
    slotIcon: EQUIPMENT_SLOT_ICONS[slot],
    currentLevel,
    nextLevel,
    maxLevel: EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL,
    cost: asNumber(EQUIPMENT_SLOT_UPGRADE_COST_BY_LEVEL[nextLevel], 0),
    canUpgrade: currentLevel < EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL,
    currentBonus,
    nextBonus
  };
}

function cloneOwnedPiece(piece) {
  return {
    id: piece.id,
    templateId: piece.templateId,
    slot: piece.slot,
    family: piece.family,
    name: piece.name,
    tier: piece.tier,
    createdAt: piece.createdAt
  };
}

function cloneEquipmentSave(equipmentSave) {
  return {
    version: asNumber(equipmentSave.version, EQUIPMENT_SCHEMA_VERSION),
    slotUpgrades: {
      weapon: asNumber(equipmentSave.slotUpgrades.weapon, 1),
      auxiliary: asNumber(equipmentSave.slotUpgrades.auxiliary, 1),
      helmet: asNumber(equipmentSave.slotUpgrades.helmet, 1),
      armor: asNumber(equipmentSave.slotUpgrades.armor, 1)
    },
    ownedPieces: (equipmentSave.ownedPieces || []).map(cloneOwnedPiece),
    equippedBySlot: {
      weapon: equipmentSave.equippedBySlot.weapon || null,
      auxiliary: equipmentSave.equippedBySlot.auxiliary || null,
      helmet: equipmentSave.equippedBySlot.helmet || null,
      armor: equipmentSave.equippedBySlot.armor || null
    }
  };
}

export function upgradeEquipmentSlot({ equipmentSave, slot, currentGold }) {
  if (!EQUIPMENT_SLOT_ORDER.includes(slot)) {
    return {
      ok: false,
      reason: 'invalid_slot'
    };
  }
  const currentLevel = asNumber(equipmentSave?.slotUpgrades?.[slot], 1);
  if (currentLevel >= EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL) {
    return {
      ok: false,
      reason: 'maxed'
    };
  }
  const nextLevel = currentLevel + 1;
  const cost = asNumber(EQUIPMENT_SLOT_UPGRADE_COST_BY_LEVEL[nextLevel], 0);
  if (asNumber(currentGold, 0) < cost) {
    return {
      ok: false,
      reason: 'not_enough_gold',
      cost
    };
  }
  const nextSave = cloneEquipmentSave(equipmentSave);
  nextSave.slotUpgrades[slot] = nextLevel;
  return {
    ok: true,
    cost,
    nextSave,
    nextLevel
  };
}

export function equipOwnedPiece(equipmentSave, pieceId) {
  const piece = getOwnedPieceById(equipmentSave, pieceId);
  if (!piece) {
    return {
      ok: false,
      reason: 'piece_not_found'
    };
  }
  if (!piece.slot || !EQUIPMENT_SLOT_ORDER.includes(piece.slot)) {
    return {
      ok: false,
      reason: 'invalid_piece_slot'
    };
  }
  if (equipmentSave?.equippedBySlot?.[piece.slot] === piece.id) {
    return {
      ok: false,
      reason: 'already_equipped'
    };
  }
  const nextSave = cloneEquipmentSave(equipmentSave);
  nextSave.equippedBySlot[piece.slot] = piece.id;
  return {
    ok: true,
    nextSave,
    slot: piece.slot,
    pieceId: piece.id
  };
}

export function unequipOwnedPiece(equipmentSave, pieceId) {
  const piece = getOwnedPieceById(equipmentSave, pieceId);
  if (!piece) {
    return {
      ok: false,
      reason: 'piece_not_found'
    };
  }
  if (!piece.slot || !EQUIPMENT_SLOT_ORDER.includes(piece.slot)) {
    return {
      ok: false,
      reason: 'invalid_piece_slot'
    };
  }
  if (equipmentSave?.equippedBySlot?.[piece.slot] !== piece.id) {
    return {
      ok: false,
      reason: 'not_equipped'
    };
  }
  const nextSave = cloneEquipmentSave(equipmentSave);
  nextSave.equippedBySlot[piece.slot] = null;
  return {
    ok: true,
    nextSave,
    slot: piece.slot,
    pieceId: piece.id
  };
}

function validateMergeMaterialForMatcher({ matcher, rootPiece, materialPiece }) {
  if (!materialPiece) {
    return false;
  }
  if (materialPiece.id === rootPiece.id) {
    return false;
  }
  if (materialPiece.slot !== rootPiece.slot) {
    return false;
  }
  if (materialPiece.family !== rootPiece.family) {
    return false;
  }
  if (materialPiece.tier !== rootPiece.tier) {
    return false;
  }
  if (matcher === 'exact_duplicate') {
    return materialPiece.templateId === rootPiece.templateId;
  }
  if (matcher === 'same_slot_same_family') {
    return true;
  }
  return false;
}

export function buildMergeRecipeSlots(rootPiece) {
  if (!rootPiece) {
    return [];
  }
  const requirements = EQUIPMENT_MERGE_REQUIREMENTS_BY_FROM_TIER[rootPiece.tier] || [];
  return requirements.map((entry, index) => ({
    index,
    matcher: entry.matcher
  }));
}

export function validateEquipmentMerge({
  equipmentSave,
  rootPieceId,
  materialPieceIds
}) {
  const rootPiece = getOwnedPieceById(equipmentSave, rootPieceId);
  if (!rootPiece) {
    return {
      ok: false,
      reason: 'missing_root',
      message: 'Select a root equipment piece.'
    };
  }
  if (rootPiece.tier >= EQUIPMENT_TIER_MAX) {
    return {
      ok: false,
      reason: 'root_max_tier',
      message: 'Root equipment is already at Tier 6.'
    };
  }

  const requirements = EQUIPMENT_MERGE_REQUIREMENTS_BY_FROM_TIER[rootPiece.tier] || [];
  const chosenIds = Array.isArray(materialPieceIds) ? materialPieceIds.filter(Boolean) : [];
  if (chosenIds.length !== requirements.length) {
    return {
      ok: false,
      reason: 'missing_material_count',
      message: `Need ${requirements.length} material piece(s).`
    };
  }

  const uniqueMaterialIds = new Set(chosenIds);
  if (uniqueMaterialIds.size !== chosenIds.length) {
    return {
      ok: false,
      reason: 'duplicate_material',
      message: 'Material slots cannot use the same piece twice.'
    };
  }

  const matchedMaterials = [];
  for (let index = 0; index < requirements.length; index += 1) {
    const requirement = requirements[index];
    const materialId = chosenIds[index];
    const materialPiece = getOwnedPieceById(equipmentSave, materialId);
    if (!materialPiece) {
      return {
        ok: false,
        reason: 'material_not_found',
        message: 'Selected material no longer exists.'
      };
    }
    if (equipmentSave.equippedBySlot[materialPiece.slot] === materialPiece.id) {
      return {
        ok: false,
        reason: 'equipped_locked',
        message: 'Equipped pieces cannot be consumed as merge materials.'
      };
    }
    if (!validateMergeMaterialForMatcher({ matcher: requirement.matcher, rootPiece, materialPiece })) {
      return {
        ok: false,
        reason: 'invalid_material',
        message: requirement.matcher === 'exact_duplicate'
          ? 'Need exact duplicate material for this tier.'
          : 'Need same-slot, same-family material for this tier.'
      };
    }
    matchedMaterials.push(materialPiece);
  }

  return {
    ok: true,
    rootPiece,
    matchedMaterials,
    requirements,
    cost: asNumber(EQUIPMENT_MERGE_COST_BY_FROM_TIER[rootPiece.tier], 0)
  };
}

export function mergeEquipmentTier({
  equipmentSave,
  rootPieceId,
  materialPieceIds,
  currentGold
}) {
  const validation = validateEquipmentMerge({
    equipmentSave,
    rootPieceId,
    materialPieceIds
  });
  if (!validation.ok) {
    return validation;
  }
  if (asNumber(currentGold, 0) < validation.cost) {
    return {
      ok: false,
      reason: 'not_enough_gold',
      cost: validation.cost,
      message: 'Not enough gold for merge.'
    };
  }

  const nextSave = cloneEquipmentSave(equipmentSave);
  const consumeIds = new Set(validation.matchedMaterials.map((piece) => piece.id));
  nextSave.ownedPieces = nextSave.ownedPieces
    .filter((piece) => !consumeIds.has(piece.id))
    .map((piece) => {
      if (piece.id !== validation.rootPiece.id) {
        return piece;
      }
      return {
        ...piece,
        tier: Math.min(EQUIPMENT_TIER_MAX, piece.tier + 1)
      };
    });

  // Root keeps equipped status if it was equipped before merge.
  if (equipmentSave.equippedBySlot[validation.rootPiece.slot] === validation.rootPiece.id) {
    nextSave.equippedBySlot[validation.rootPiece.slot] = validation.rootPiece.id;
  }

  return {
    ok: true,
    cost: validation.cost,
    nextSave,
    rootPieceId: validation.rootPiece.id,
    slot: validation.rootPiece.slot,
    nextTier: Math.min(EQUIPMENT_TIER_MAX, validation.rootPiece.tier + 1)
  };
}

function formatEffectValue(stat, value) {
  if (['blockChance', 'doubleStrike', 'lifesteal', 'nightDamageTakenReduction'].includes(stat)) {
    return `${Math.round(asNumber(value, 0) * 100)}%`;
  }
  return String(asNumber(value, 0));
}

function buildEffectText(effect) {
  const conditionLabel = CONDITION_LABELS[effect.condition] || effect.condition;
  const statLabel = STAT_LABELS[effect.stat] || effect.stat;
  const valueText = formatEffectValue(effect.stat, effect.value);
  return `${conditionLabel}: +${valueText} ${statLabel}`;
}

function buildTierLineEffects(piece, tier) {
  if (!piece) {
    return [];
  }
  if (tier === 2) {
    return getTier2Effects(piece.slot);
  }
  if (tier >= 3 && tier <= 6) {
    return getLineEffects(piece, tier - 2);
  }
  return [];
}

function buildTierLineLabel(tier) {
  if (tier === 1) {
    return 'Tier 1 · Base / Unmerged';
  }
  if (tier === 2) {
    return 'Tier 2 · Base growth light';
  }
  if (tier === 3) {
    return 'Tier 3 · Line 1';
  }
  if (tier === 4) {
    return 'Tier 4 · Line 2';
  }
  if (tier === 5) {
    return 'Tier 5 · Line 3';
  }
  if (tier === 6) {
    return 'Tier 6 · Line 4';
  }
  return `Tier ${tier}`;
}

function buildPieceTierLines(piece) {
  const lines = [];
  for (let tier = 1; tier <= 6; tier += 1) {
    const effects = buildTierLineEffects(piece, tier).map(buildEffectText);
    lines.push({
      tier,
      label: buildTierLineLabel(tier),
      effects,
      unlocked: piece.tier >= tier
    });
  }
  return lines;
}

export function getMergeEffectsSummary(piece) {
  return getPieceMergeEffects(piece).map(buildEffectText);
}

function compareOwnedPieces(a, b, equippedBySlot) {
  const aEquipped = equippedBySlot[a.slot] === a.id ? 1 : 0;
  const bEquipped = equippedBySlot[b.slot] === b.id ? 1 : 0;
  if (aEquipped !== bEquipped) {
    return bEquipped - aEquipped;
  }
  const slotDiff = (SLOT_SORT_INDEX.get(a.slot) || 0) - (SLOT_SORT_INDEX.get(b.slot) || 0);
  if (slotDiff !== 0) {
    return slotDiff;
  }
  if (a.tier !== b.tier) {
    return b.tier - a.tier;
  }
  if (a.family !== b.family) {
    return a.family.localeCompare(b.family);
  }
  return a.name.localeCompare(b.name);
}

function toOwnedPieceView(piece, equipmentSave) {
  const equipped = equipmentSave.equippedBySlot[piece.slot] === piece.id;
  const effectsSummary = getMergeEffectsSummary(piece);
  return {
    id: piece.id,
    templateId: piece.templateId,
    name: piece.name,
    tier: piece.tier,
    slot: piece.slot,
    slotLabel: EQUIPMENT_SLOT_LABELS[piece.slot],
    slotIcon: EQUIPMENT_SLOT_ICONS[piece.slot],
    family: piece.family,
    familyLabel: EQUIPMENT_FAMILY_LABELS[piece.family],
    familyIcon: EQUIPMENT_FAMILY_ICONS[piece.family],
    equipped,
    lockedForFodder: equipped,
    effectsSummary,
    tierLines: buildPieceTierLines(piece)
  };
}

export function buildEquipmentView(equipmentSave, currentGold) {
  const normalized = normalizeEquipmentSave(equipmentSave);
  const slots = EQUIPMENT_SLOT_ORDER.map((slot) => {
    const piece = getEquippedPieceBySlot(normalized, slot);
    const level = normalized.slotUpgrades[slot];
    const preview = buildSlotUpgradePreview(slot, level);
    const canAffordUpgrade = asNumber(currentGold, 0) >= preview.cost;
    return {
      slot,
      slotLabel: EQUIPMENT_SLOT_LABELS[slot],
      slotIcon: EQUIPMENT_SLOT_ICONS[slot],
      pieceId: piece?.id || null,
      pieceName: piece?.name || 'Empty',
      pieceTier: piece ? piece.tier : null,
      pieceFamily: piece?.family || null,
      pieceFamilyLabel: piece ? EQUIPMENT_FAMILY_LABELS[piece.family] : '-',
      pieceFamilyIcon: piece ? EQUIPMENT_FAMILY_ICONS[piece.family] : '—',
      level: preview.currentLevel,
      maxLevel: preview.maxLevel,
      nextLevel: preview.nextLevel,
      nextCost: preview.cost,
      canUpgrade: preview.canUpgrade,
      canAffordUpgrade,
      currentBonus: preview.currentBonus,
      nextBonus: preview.nextBonus
    };
  });

  const ownedPieces = [...normalized.ownedPieces]
    .sort((a, b) => compareOwnedPieces(a, b, normalized.equippedBySlot))
    .map((piece) => toOwnedPieceView(piece, normalized));

  return {
    slots,
    ownedPieces
  };
}

export function createDefaultEquipmentRuntime() {
  return {
    afterWinNextCombatActive: false
  };
}

export function consumeAfterWinNextCombatBuff(runtime) {
  return {
    ...runtime,
    afterWinNextCombatActive: false
  };
}

export function activateAfterWinNextCombatBuff(runtime) {
  return {
    ...runtime,
    afterWinNextCombatActive: true
  };
}

export function getMergeCostFromRootTier(tier) {
  return asNumber(EQUIPMENT_MERGE_COST_BY_FROM_TIER[tier], 0);
}

export function grantRandomTier1EquipmentDrop(equipmentSave) {
  const normalized = normalizeEquipmentSave(equipmentSave);
  const template = EQUIPMENT_PIECE_TEMPLATES[Math.floor(Math.random() * EQUIPMENT_PIECE_TEMPLATES.length)];
  if (!template) {
    return {
      ok: false,
      reason: 'missing_template'
    };
  }

  const now = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000000);
  const pieceId = `eq_drop_${now}_${randomSuffix}`;
  const piece = createPieceFromTemplate(template.templateId, pieceId, 1, now);
  const nextSave = cloneEquipmentSave(normalized);
  nextSave.ownedPieces.push(piece);

  return {
    ok: true,
    nextSave,
    piece
  };
}

