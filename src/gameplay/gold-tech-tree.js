import {
  GOLD_TECH_TREE_NODE_IDS,
  GOLD_TECH_TREE_NODES,
  getGoldTechTreeNodeLevel,
  normalizeGoldTechTreeSave
} from '../data/gold-tech-tree-config.js';

function getNodeDef(nodeId) {
  return GOLD_TECH_TREE_NODES.find((node) => node.id === nodeId) || null;
}

function isNodeMaxed(treeSave, nodeId) {
  const node = getNodeDef(nodeId);
  if (!node || node.maxLevel <= 0) {
    return true;
  }
  return getGoldTechTreeNodeLevel(treeSave, nodeId) >= node.maxLevel;
}

export function isGoldTechTreeNodeUnlocked(treeSave, nodeId) {
  const normalized = normalizeGoldTechTreeSave(treeSave);
  switch (nodeId) {
    case GOLD_TECH_TREE_NODE_IDS.baseCamp:
      return true;
    case GOLD_TECH_TREE_NODE_IDS.sustain1:
    case GOLD_TECH_TREE_NODE_IDS.combat1:
    case GOLD_TECH_TREE_NODE_IDS.economy1:
      return true;
    case GOLD_TECH_TREE_NODE_IDS.sustain2:
      return isNodeMaxed(normalized, GOLD_TECH_TREE_NODE_IDS.sustain1);
    case GOLD_TECH_TREE_NODE_IDS.combat2:
      return isNodeMaxed(normalized, GOLD_TECH_TREE_NODE_IDS.combat1);
    case GOLD_TECH_TREE_NODE_IDS.economy2:
      return isNodeMaxed(normalized, GOLD_TECH_TREE_NODE_IDS.economy1);
    case GOLD_TECH_TREE_NODE_IDS.capstone1:
      return (
        isNodeMaxed(normalized, GOLD_TECH_TREE_NODE_IDS.sustain2) &&
        isNodeMaxed(normalized, GOLD_TECH_TREE_NODE_IDS.combat2) &&
        isNodeMaxed(normalized, GOLD_TECH_TREE_NODE_IDS.economy2)
      );
    default:
      return false;
  }
}

function getNextLevelCost(node, currentLevel) {
  if (!node || currentLevel >= node.maxLevel) {
    return 0;
  }
  return Number(node.costs[currentLevel] || 0);
}

function getStateTag(unlocked, level, maxLevel) {
  if (maxLevel <= 0) {
    return 'Purchased';
  }
  if (!unlocked) {
    return 'Locked';
  }
  if (level >= maxLevel) {
    return 'Max';
  }
  if (level > 0) {
    return 'Purchased';
  }
  return 'Available';
}

function getMainEffectText(node, level) {
  if (node.maxLevel <= 0) {
    return 'Structural root only';
  }

  const effectSummary = node.effectLabels.join(' | ');
  const nextLevel = Math.min(node.maxLevel, level + 1);
  const nextEffect = node.effectLabels[nextLevel - 1] || node.effectLabels.at(-1) || 'No effect';
  return level >= node.maxLevel ? effectSummary : `${effectSummary} | Next: ${nextEffect}`;
}

export function buildGoldTechTreeView(treeSave, currentRuneShard) {
  const normalized = normalizeGoldTechTreeSave(treeSave);
  const nodes = GOLD_TECH_TREE_NODES.map((node) => {
    const level = node.maxLevel <= 0 ? 0 : getGoldTechTreeNodeLevel(normalized, node.id);
    const unlocked = isGoldTechTreeNodeUnlocked(normalized, node.id);
    const nextCost = getNextLevelCost(node, level);
    const status = getStateTag(unlocked, level, node.maxLevel);
    const canBuy = node.maxLevel > 0 && unlocked && level < node.maxLevel && currentRuneShard >= nextCost;

    return {
      ...node,
      level,
      unlocked,
      nextCost,
      status,
      canBuy,
      mainEffectText: getMainEffectText(node, level)
    };
  });

  return {
    nodes,
    rows: [
      [GOLD_TECH_TREE_NODE_IDS.capstone1],
      [GOLD_TECH_TREE_NODE_IDS.sustain2, GOLD_TECH_TREE_NODE_IDS.combat2, GOLD_TECH_TREE_NODE_IDS.economy2],
      [GOLD_TECH_TREE_NODE_IDS.sustain1, GOLD_TECH_TREE_NODE_IDS.combat1, GOLD_TECH_TREE_NODE_IDS.economy1],
      [GOLD_TECH_TREE_NODE_IDS.baseCamp]
    ]
  };
}

export function buyGoldTechTreeNode({ treeSave, nodeId, currentRuneShard, purchasedAt }) {
  const normalized = normalizeGoldTechTreeSave(treeSave);
  const node = getNodeDef(nodeId);
  if (!node) {
    return { ok: false, reason: 'unknown_node' };
  }
  if (node.maxLevel <= 0) {
    return { ok: false, reason: 'structural_node' };
  }
  if (!isGoldTechTreeNodeUnlocked(normalized, nodeId)) {
    return { ok: false, reason: 'locked' };
  }

  const currentLevel = getGoldTechTreeNodeLevel(normalized, nodeId);
  if (currentLevel >= node.maxLevel) {
    return { ok: false, reason: 'maxed' };
  }

  const cost = getNextLevelCost(node, currentLevel);
  if (currentRuneShard < cost) {
    return { ok: false, reason: 'not_enough_rune_shard' };
  }

  const nextSave = normalizeGoldTechTreeSave({
    ...normalized,
    nodes: {
      ...normalized.nodes,
      [nodeId]: {
        level: currentLevel + 1,
        purchasedAt: purchasedAt || new Date().toISOString()
      }
    }
  });

  return {
    ok: true,
    cost,
    nextSave,
    nextLevel: currentLevel + 1
  };
}
