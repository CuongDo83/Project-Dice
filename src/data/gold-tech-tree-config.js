export const GOLD_TECH_TREE_VERSION = 1;

export const GOLD_TECH_TREE_NODE_IDS = {
  baseCamp: 'base_camp',
  sustain1: 'sustain_1',
  combat1: 'combat_1',
  economy1: 'economy_1',
  sustain2: 'sustain_2',
  combat2: 'combat_2',
  economy2: 'economy_2',
  capstone1: 'capstone_1'
};

export const GOLD_TECH_TREE_NODES = [
  {
    id: GOLD_TECH_TREE_NODE_IDS.baseCamp,
    icon: '🏕️',
    name: 'Base Camp',
    lane: 'Root',
    maxLevel: 0,
    costs: [0, 0, 0],
    effectLabels: ['Structural root only'],
    effectByLevel: [{ hp: 0, dmgMin: 0, dmgMax: 0, goldEfficiency: 0 }]
  },
  {
    id: GOLD_TECH_TREE_NODE_IDS.sustain1,
    icon: '🛡️',
    name: 'Iron Hide',
    lane: 'Sustain',
    maxLevel: 3,
    costs: [16, 24, 36],
    effectLabels: ['+10 / +20 / +30 HP'],
    effectByLevel: [{ hp: 10 }, { hp: 20 }, { hp: 30 }]
  },
  {
    id: GOLD_TECH_TREE_NODE_IDS.combat1,
    icon: '🗡️',
    name: 'Steady Hand',
    lane: 'Combat',
    maxLevel: 3,
    costs: [16, 24, 36],
    effectLabels: ['+3 / +3 / +4 dmgMin'],
    effectByLevel: [{ dmgMin: 3 }, { dmgMin: 3 }, { dmgMin: 4 }]
  },
  {
    id: GOLD_TECH_TREE_NODE_IDS.economy1,
    icon: '🪙',
    name: 'Clean Loot',
    lane: 'Economy',
    maxLevel: 3,
    costs: [16, 24, 36],
    effectLabels: ['+5% / +6% / +7% total gold'],
    effectByLevel: [{ goldEfficiency: 0.05 }, { goldEfficiency: 0.06 }, { goldEfficiency: 0.07 }]
  },
  {
    id: GOLD_TECH_TREE_NODE_IDS.sustain2,
    icon: '🧱',
    name: 'Veteran Body',
    lane: 'Sustain',
    maxLevel: 3,
    costs: [28, 42, 60],
    effectLabels: ['+5 / +10 / +15 HP'],
    effectByLevel: [{ hp: 5 }, { hp: 10 }, { hp: 15 }]
  },
  {
    id: GOLD_TECH_TREE_NODE_IDS.combat2,
    icon: '⚔️',
    name: "Finisher's Edge",
    lane: 'Combat',
    maxLevel: 3,
    costs: [28, 42, 60],
    effectLabels: ['+3 / +3 / +4 dmgMax'],
    effectByLevel: [{ dmgMax: 3 }, { dmgMax: 3 }, { dmgMax: 4 }]
  },
  {
    id: GOLD_TECH_TREE_NODE_IDS.economy2,
    icon: '📜',
    name: 'Contract Bonus',
    lane: 'Economy',
    maxLevel: 3,
    costs: [28, 42, 60],
    effectLabels: ['+4% / +5% / +6% total gold'],
    effectByLevel: [{ goldEfficiency: 0.04 }, { goldEfficiency: 0.05 }, { goldEfficiency: 0.06 }]
  },
  {
    id: GOLD_TECH_TREE_NODE_IDS.capstone1,
    icon: '👑',
    name: 'Campaign Command',
    lane: 'Capstone',
    maxLevel: 3,
    costs: [52, 72, 96],
    effectLabels: ['Lv1: +2 dmgMin', 'Lv2: +2 dmgMax', 'Lv3: +5% total gold'],
    effectByLevel: [{ dmgMin: 2 }, { dmgMax: 2 }, { goldEfficiency: 0.05 }]
  }
];

function clampLevel(level, maxLevel) {
  if (!Number.isFinite(level)) {
    return 0;
  }
  return Math.max(0, Math.min(maxLevel, Math.floor(level)));
}

export function createDefaultGoldTechTreeSave() {
  return {
    version: GOLD_TECH_TREE_VERSION,
    nodes: {
      [GOLD_TECH_TREE_NODE_IDS.sustain1]: { level: 0, purchasedAt: null },
      [GOLD_TECH_TREE_NODE_IDS.combat1]: { level: 0, purchasedAt: null },
      [GOLD_TECH_TREE_NODE_IDS.economy1]: { level: 0, purchasedAt: null },
      [GOLD_TECH_TREE_NODE_IDS.sustain2]: { level: 0, purchasedAt: null },
      [GOLD_TECH_TREE_NODE_IDS.combat2]: { level: 0, purchasedAt: null },
      [GOLD_TECH_TREE_NODE_IDS.economy2]: { level: 0, purchasedAt: null },
      [GOLD_TECH_TREE_NODE_IDS.capstone1]: { level: 0, purchasedAt: null }
    }
  };
}

export function normalizeGoldTechTreeSave(rawValue) {
  const defaults = createDefaultGoldTechTreeSave();
  if (!rawValue || typeof rawValue !== 'object') {
    return defaults;
  }

  const normalizedNodes = { ...defaults.nodes };
  Object.keys(defaults.nodes).forEach((nodeId) => {
    const rawNode = rawValue.nodes?.[nodeId];
    if (!rawNode || typeof rawNode !== 'object') {
      return;
    }
    const nodeDef = GOLD_TECH_TREE_NODES.find((entry) => entry.id === nodeId);
    const maxLevel = nodeDef?.maxLevel ?? 3;
    normalizedNodes[nodeId] = {
      level: clampLevel(Number(rawNode.level || 0), maxLevel),
      purchasedAt: rawNode.purchasedAt || null
    };
  });

  return {
    version: Number(rawValue.version || GOLD_TECH_TREE_VERSION),
    nodes: normalizedNodes
  };
}

export function getGoldTechTreeNodeLevel(treeSave, nodeId) {
  const level = Number(treeSave?.nodes?.[nodeId]?.level || 0);
  return Math.max(0, level);
}

export function getGoldTechTreeBonuses(treeSave) {
  const bonuses = {
    hp: 0,
    dmgMin: 0,
    dmgMax: 0,
    goldEfficiency: 0
  };

  GOLD_TECH_TREE_NODES.forEach((node) => {
    if (node.maxLevel <= 0) {
      return;
    }
    const level = clampLevel(getGoldTechTreeNodeLevel(treeSave, node.id), node.maxLevel);
    for (let step = 0; step < level; step += 1) {
      const effect = node.effectByLevel[step] || {};
      bonuses.hp += Number(effect.hp || 0);
      bonuses.dmgMin += Number(effect.dmgMin || 0);
      bonuses.dmgMax += Number(effect.dmgMax || 0);
      bonuses.goldEfficiency += Number(effect.goldEfficiency || 0);
    }
  });

  return bonuses;
}
