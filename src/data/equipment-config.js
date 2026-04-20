export const EQUIPMENT_SCHEMA_VERSION = 1;

export const EQUIPMENT_SLOT_ORDER = ['weapon', 'auxiliary', 'helmet', 'armor'];

export const EQUIPMENT_SLOT_LABELS = {
  weapon: 'Weapon',
  auxiliary: 'Auxiliary Equipment',
  helmet: 'Helmet',
  armor: 'Armor'
};

export const EQUIPMENT_FAMILY_ORDER = ['stability', 'burst', 'guard', 'sustain'];

export const EQUIPMENT_FAMILY_LABELS = {
  stability: 'Stability',
  burst: 'Burst',
  guard: 'Guard',
  sustain: 'Sustain'
};

export const EQUIPMENT_FAMILY_ICONS = {
  stability: '⚖️',
  burst: '💥',
  guard: '🛡️',
  sustain: '🩸'
};

export const EQUIPMENT_SLOT_ICONS = {
  weapon: '🗡️',
  auxiliary: '💍',
  helmet: '⛑️',
  armor: '🦺'
};

export const EQUIPMENT_SLOT_UPGRADE_GROWTH = {
  weapon: { dmgMin: 1, dmgMax: 2 },
  auxiliary: { dmgMin: 2, dmgMax: 1 },
  helmet: { maxHp: 10 },
  armor: { maxHp: 10 }
};

export const EQUIPMENT_SLOT_UPGRADE_COST_BY_LEVEL = {
  1: 0,
  2: 20,
  3: 25,
  4: 30,
  5: 35,
  6: 45,
  7: 60,
  8: 75,
  9: 90,
  10: 100,
  11: 115,
  12: 130,
  13: 145,
  14: 160,
  15: 180,
  16: 205,
  17: 225,
  18: 250,
  19: 275,
  20: 300
};

export const EQUIPMENT_SLOT_UPGRADE_MAX_LEVEL = 20;

export const EQUIPMENT_MERGE_COST_BY_FROM_TIER = {
  1: 90,
  2: 180,
  3: 300,
  4: 480,
  5: 750
};

export const EQUIPMENT_TIER_MAX = 6;

export const EQUIPMENT_MERGE_REQUIREMENTS_BY_FROM_TIER = {
  1: [{ matcher: 'exact_duplicate' }, { matcher: 'exact_duplicate' }],
  2: [{ matcher: 'exact_duplicate' }, { matcher: 'exact_duplicate' }],
  3: [{ matcher: 'exact_duplicate' }, { matcher: 'exact_duplicate' }],
  4: [{ matcher: 'same_slot_same_family' }],
  5: [{ matcher: 'same_slot_same_family' }, { matcher: 'same_slot_same_family' }]
};

export const EQUIPMENT_TIER2_BONUS_BY_SLOT = {
  weapon: [{ condition: 'always', stat: 'dmgMin', value: 1 }, { condition: 'always', stat: 'dmgMax', value: 1 }],
  auxiliary: [{ condition: 'always', stat: 'dmgMin', value: 1 }, { condition: 'always', stat: 'dmgMax', value: 1 }],
  helmet: [{ condition: 'always', stat: 'maxHp', value: 10 }],
  armor: [{ condition: 'always', stat: 'maxHp', value: 10 }]
};

export const EQUIPMENT_LINE_EFFECTS_BY_FAMILY = {
  guard: {
    1: {
      auxiliary: [{ condition: 'always', stat: 'blockChance', value: 0.06 }],
      weapon: [{ condition: 'first_hit', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'night', stat: 'nightDamageTakenReduction', value: 0.1 }],
      armor: [{ condition: 'always', stat: 'maxHp', value: 20 }]
    },
    2: {
      auxiliary: [{ condition: 'after_win_next_combat', stat: 'blockChance', value: 0.04 }],
      weapon: [{ condition: 'always', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'always', stat: 'blockChance', value: 0.03 }],
      armor: [{ condition: 'always', stat: 'maxHp', value: 10 }]
    },
    3: {
      auxiliary: [{ condition: 'night', stat: 'blockChance', value: 0.04 }],
      weapon: [{ condition: 'enemy_below_half', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'after_win_next_combat', stat: 'blockChance', value: 0.03 }],
      armor: [{ condition: 'night', stat: 'nightDamageTakenReduction', value: 0.05 }]
    },
    4: {
      auxiliary: [{ condition: 'first_hit', stat: 'blockChance', value: 0.04 }],
      weapon: [{ condition: 'after_win_next_combat', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'always', stat: 'maxHp', value: 10 }],
      armor: [{ condition: 'always', stat: 'blockChance', value: 0.03 }]
    }
  },
  stability: {
    1: {
      auxiliary: [{ condition: 'always', stat: 'dmgMin', value: 3 }],
      weapon: [{ condition: 'first_hit', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'after_win_next_combat', stat: 'dmgMin', value: 1 }],
      armor: [{ condition: 'night', stat: 'dmgMin', value: 1 }]
    },
    2: {
      auxiliary: [{ condition: 'after_win_next_combat', stat: 'dmgMin', value: 2 }],
      weapon: [{ condition: 'always', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'night', stat: 'dmgMin', value: 1 }],
      armor: [{ condition: 'enemy_below_half', stat: 'dmgMin', value: 1 }]
    },
    3: {
      auxiliary: [{ condition: 'night', stat: 'dmgMin', value: 2 }],
      weapon: [{ condition: 'enemy_below_half', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'first_hit', stat: 'dmgMin', value: 1 }],
      armor: [{ condition: 'after_win_next_combat', stat: 'dmgMin', value: 1 }]
    },
    4: {
      auxiliary: [{ condition: 'enemy_below_half', stat: 'dmgMin', value: 2 }],
      weapon: [{ condition: 'after_win_next_combat', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'always', stat: 'dmgMin', value: 1 }],
      armor: [{ condition: 'first_hit', stat: 'dmgMin', value: 1 }]
    }
  },
  burst: {
    1: {
      auxiliary: [{ condition: 'always', stat: 'doubleStrike', value: 0.06 }],
      weapon: [{ condition: 'always', stat: 'dmgMax', value: 3 }],
      helmet: [{ condition: 'first_hit', stat: 'dmgMax', value: 2 }],
      armor: [{ condition: 'enemy_below_half', stat: 'dmgMax', value: 2 }]
    },
    2: {
      auxiliary: [{ condition: 'always', stat: 'dmgMax', value: 4 }],
      weapon: [{ condition: 'always', stat: 'doubleStrike', value: 0.05 }],
      helmet: [{ condition: 'enemy_below_half', stat: 'dmgMax', value: 2 }],
      armor: [{ condition: 'night', stat: 'dmgMax', value: 2 }]
    },
    3: {
      auxiliary: [{ condition: 'first_hit', stat: 'dmgMax', value: 4 }],
      weapon: [{ condition: 'enemy_below_half', stat: 'dmgMax', value: 3 }],
      helmet: [{ condition: 'always', stat: 'doubleStrike', value: 0.03 }],
      armor: [{ condition: 'first_hit', stat: 'dmgMax', value: 2 }]
    },
    4: {
      auxiliary: [{ condition: 'enemy_below_half', stat: 'dmgMax', value: 4 }],
      weapon: [{ condition: 'first_hit', stat: 'dmgMax', value: 3 }],
      helmet: [{ condition: 'night', stat: 'dmgMax', value: 2 }],
      armor: [{ condition: 'always', stat: 'doubleStrike', value: 0.03 }]
    }
  },
  sustain: {
    1: {
      auxiliary: [{ condition: 'always', stat: 'postCombatHeal', value: 5 }],
      weapon: [{ condition: 'always', stat: 'lifesteal', value: 0.04 }],
      helmet: [{ condition: 'always', stat: 'postCombatHeal', value: 3 }],
      armor: [{ condition: 'always', stat: 'lifesteal', value: 0.02 }]
    },
    2: {
      auxiliary: [{ condition: 'after_win', stat: 'postCombatHeal', value: 5 }],
      weapon: [{ condition: 'enemy_below_half', stat: 'lifesteal', value: 0.03 }],
      helmet: [{ condition: 'night', stat: 'postCombatHeal', value: 3 }],
      armor: [{ condition: 'always', stat: 'postCombatHeal', value: 5 }]
    },
    3: {
      auxiliary: [{ condition: 'night', stat: 'postCombatHeal', value: 5 }],
      weapon: [{ condition: 'always', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'after_win', stat: 'postCombatHeal', value: 3 }],
      armor: [{ condition: 'enemy_below_half', stat: 'lifesteal', value: 0.02 }]
    },
    4: {
      auxiliary: [{ condition: 'always', stat: 'lifesteal', value: 0.04 }],
      weapon: [{ condition: 'after_win_next_combat', stat: 'dmgMin', value: 2 }],
      helmet: [{ condition: 'always', stat: 'postCombatHeal', value: 5 }],
      armor: [{ condition: 'night', stat: 'lifesteal', value: 0.02 }]
    }
  }
};

export const EQUIPMENT_PIECE_TEMPLATES = [
  { templateId: 'stability_weapon_01', slot: 'weapon', family: 'stability', name: 'Stability Weapon' },
  { templateId: 'stability_auxiliary_01', slot: 'auxiliary', family: 'stability', name: 'Stability Auxiliary Equipment' },
  { templateId: 'stability_helmet_01', slot: 'helmet', family: 'stability', name: 'Stability Helmet' },
  { templateId: 'stability_armor_01', slot: 'armor', family: 'stability', name: 'Stability Armor' },
  { templateId: 'burst_weapon_01', slot: 'weapon', family: 'burst', name: 'Burst Weapon' },
  { templateId: 'burst_auxiliary_01', slot: 'auxiliary', family: 'burst', name: 'Burst Auxiliary Equipment' },
  { templateId: 'burst_helmet_01', slot: 'helmet', family: 'burst', name: 'Burst Helmet' },
  { templateId: 'burst_armor_01', slot: 'armor', family: 'burst', name: 'Burst Armor' },
  { templateId: 'guard_weapon_01', slot: 'weapon', family: 'guard', name: 'Guard Weapon' },
  { templateId: 'guard_auxiliary_01', slot: 'auxiliary', family: 'guard', name: 'Guard Auxiliary Equipment' },
  { templateId: 'guard_helmet_01', slot: 'helmet', family: 'guard', name: 'Guard Helmet' },
  { templateId: 'guard_armor_01', slot: 'armor', family: 'guard', name: 'Guard Armor' },
  { templateId: 'sustain_weapon_01', slot: 'weapon', family: 'sustain', name: 'Sustain Weapon' },
  { templateId: 'sustain_auxiliary_01', slot: 'auxiliary', family: 'sustain', name: 'Sustain Auxiliary Equipment' },
  { templateId: 'sustain_helmet_01', slot: 'helmet', family: 'sustain', name: 'Sustain Helmet' },
  { templateId: 'sustain_armor_01', slot: 'armor', family: 'sustain', name: 'Sustain Armor' }
];

export const EQUIPMENT_STARTER_PIECE_BLUEPRINTS = [
  { templateId: 'stability_weapon_01', tier: 1, equipped: true },
  { templateId: 'stability_auxiliary_01', tier: 1, equipped: true },
  { templateId: 'stability_helmet_01', tier: 1, equipped: true },
  { templateId: 'stability_armor_01', tier: 1, equipped: true },
  { templateId: 'burst_weapon_01', tier: 1, equipped: false },
  { templateId: 'burst_auxiliary_01', tier: 1, equipped: false },
  { templateId: 'burst_helmet_01', tier: 1, equipped: false },
  { templateId: 'burst_armor_01', tier: 1, equipped: false },
  { templateId: 'guard_weapon_01', tier: 1, equipped: false },
  { templateId: 'guard_auxiliary_01', tier: 1, equipped: false },
  { templateId: 'guard_helmet_01', tier: 1, equipped: false },
  { templateId: 'guard_armor_01', tier: 1, equipped: false },
  { templateId: 'sustain_weapon_01', tier: 1, equipped: false },
  { templateId: 'sustain_auxiliary_01', tier: 1, equipped: false },
  { templateId: 'sustain_helmet_01', tier: 1, equipped: false },
  { templateId: 'sustain_armor_01', tier: 1, equipped: false }
];
