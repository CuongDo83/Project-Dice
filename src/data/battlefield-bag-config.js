export const BAG_MAX_SLOTS = 4;
export const COMBAT_CHANCE_CAP = 0.5;

function effect(overrides) {
  return {
    maxHp: 0,
    dmgMin: 0,
    dmgMax: 0,
    minRoll: 0,
    maxRoll: 0,
    healEfficiency: 0,
    critChance: 0,
    critDamage: 0,
    blockChance: 0,
    lifesteal: 0,
    doubleStrike: 0,
    dayDmgMin: 0,
    dayDmgMax: 0,
    dayMaxRoll: 0,
    dayCritChance: 0,
    nightDamageTakenReduction: 0,
    nightDmgMin: 0,
    nightDmgMax: 0,
    ...overrides
  };
}

export const BAG_ITEMS = [
  {
    id: 'pathfinder_token',
    name: 'Pathfinder Token',
    icon: '[PT]',
    slotType: 'utility',
    family: 'Mobility',
    role: 'progress',
    tiers: [effect({ maxRoll: 1 }), effect({ maxRoll: 2 }), effect({ maxRoll: 3 })],
    phaseWeight: { early: 14, mid: 8, end: 4 }
  },
  {
    id: 'step_anchor',
    name: 'Step Anchor',
    icon: '[SA]',
    slotType: 'utility',
    family: 'Control',
    role: 'progress',
    tiers: [effect({ minRoll: 1 }), effect({ minRoll: 2 }), effect({ minRoll: 3 })],
    phaseWeight: { early: 13, mid: 8, end: 4 }
  },
  {
    id: 'field_kit',
    name: 'Field Kit',
    icon: '[FK]',
    slotType: 'utility',
    family: 'Sustain Utility',
    role: 'recovery',
    tiers: [effect({ healEfficiency: 10 }), effect({ healEfficiency: 20 }), effect({ healEfficiency: 30 })],
    phaseWeight: { early: 9, mid: 7, end: 4 }
  },
  {
    id: 'sun_compass',
    name: 'Sun Compass',
    icon: '[SC]',
    slotType: 'utility',
    family: 'Day Mobility',
    role: 'progress',
    tiers: [effect({ dayMaxRoll: 1 }), effect({ dayMaxRoll: 2 }), effect({ dayMaxRoll: 3 })],
    phaseWeight: { early: 10, mid: 9, end: 4 }
  },
  {
    id: 'moon_ward',
    name: 'Moon Ward',
    icon: '[MW]',
    slotType: 'utility',
    family: 'Night Guard',
    role: 'recovery',
    tiers: [
      effect({ nightDamageTakenReduction: 0.1 }),
      effect({ nightDamageTakenReduction: 0.2 }),
      effect({ nightDamageTakenReduction: 0.3 })
    ],
    phaseWeight: { early: 6, mid: 9, end: 12 }
  },
  {
    id: 'guard_crest',
    name: 'Guard Crest',
    icon: '[GC]',
    slotType: 'combat',
    family: 'Guard',
    role: 'recovery',
    tiers: [effect({ maxHp: 20 }), effect({ maxHp: 30 }), effect({ maxHp: 40 })],
    phaseWeight: { early: 14, mid: 10, end: 6 }
  },
  {
    id: 'stable_edge',
    name: 'Stable Edge',
    icon: '[SE]',
    slotType: 'combat',
    family: 'Stability',
    role: 'progress',
    tiers: [effect({ dmgMin: 10 }), effect({ dmgMin: 20 }), effect({ dmgMin: 30 })],
    phaseWeight: { early: 13, mid: 11, end: 7 }
  },
  {
    id: 'power_edge',
    name: 'Power Edge',
    icon: '[PE]',
    slotType: 'combat',
    family: 'Burst',
    role: 'progress',
    tiers: [effect({ dmgMax: 10 }), effect({ dmgMax: 20 }), effect({ dmgMax: 30 })],
    phaseWeight: { early: 10, mid: 10, end: 8 }
  },
  {
    id: 'keen_eye',
    name: 'Keen Eye',
    icon: '[KE]',
    slotType: 'combat',
    family: 'Precision',
    role: 'progress',
    tiers: [effect({ critChance: 0.08 }), effect({ critChance: 0.16 }), effect({ critChance: 0.24 })],
    phaseWeight: { early: 8, mid: 10, end: 9 }
  },
  {
    id: 'fatal_fang',
    name: 'Fatal Fang',
    icon: '[FF]',
    slotType: 'combat',
    family: 'Execution',
    role: 'progress',
    tiers: [effect({ critDamage: 0.2 }), effect({ critDamage: 0.4 }), effect({ critDamage: 0.6 })],
    phaseWeight: { early: 5, mid: 8, end: 10 }
  },
  {
    id: 'iron_guard',
    name: 'Iron Guard',
    icon: '[IG]',
    slotType: 'combat',
    family: 'Fortify',
    role: 'recovery',
    tiers: [effect({ blockChance: 0.08 }), effect({ blockChance: 0.16 }), effect({ blockChance: 0.24 })],
    phaseWeight: { early: 8, mid: 9, end: 10 }
  },
  {
    id: 'blood_charm',
    name: 'Blood Charm',
    icon: '[BC]',
    slotType: 'combat',
    family: 'Sustain Combat',
    role: 'recovery',
    tiers: [effect({ lifesteal: 0.06 }), effect({ lifesteal: 0.12 }), effect({ lifesteal: 0.18 })],
    phaseWeight: { early: 7, mid: 9, end: 9 }
  },
  {
    id: 'twin_sigil',
    name: 'Twin Sigil',
    icon: '[TS]',
    slotType: 'combat',
    family: 'Tempo Burst',
    role: 'progress',
    tiers: [effect({ doubleStrike: 0.06 }), effect({ doubleStrike: 0.12 }), effect({ doubleStrike: 0.18 })],
    phaseWeight: { early: 6, mid: 9, end: 10 }
  },
  {
    id: 'sun_fang',
    name: 'Sun Fang',
    icon: '[SF]',
    slotType: 'combat',
    family: 'Day Combat',
    role: 'progress',
    tiers: [
      effect({ dayDmgMin: 10, dayDmgMax: 10 }),
      effect({ dayDmgMin: 20, dayDmgMax: 20 }),
      effect({ dayDmgMin: 30, dayDmgMax: 30 })
    ],
    phaseWeight: { early: 10, mid: 10, end: 5 }
  },
  {
    id: 'moon_fang',
    name: 'Moon Fang',
    icon: '[MF]',
    slotType: 'combat',
    family: 'Night Combat',
    role: 'recovery',
    tiers: [
      effect({ nightDmgMin: 10, nightDmgMax: 10 }),
      effect({ nightDmgMin: 20, nightDmgMax: 20 }),
      effect({ nightDmgMin: 30, nightDmgMax: 30 })
    ],
    phaseWeight: { early: 5, mid: 8, end: 12 }
  }
];

export const FUSION_ITEMS = [
  { id: 'route_master', name: 'Route Master', recipe: ['pathfinder_token', 'step_anchor'], bonus: effect({ maxRoll: 1 }), slotType: 'utility' },
  { id: 'field_marshal', name: 'Field Marshal', recipe: ['step_anchor', 'field_kit'], bonus: effect({ healEfficiency: 10 }), slotType: 'utility' },
  { id: 'scavenger_sprint', name: 'Scavenger Sprint', recipe: ['pathfinder_token', 'field_kit'], bonus: effect({ maxRoll: 1 }), slotType: 'utility' },
  { id: 'sunrunner', name: 'Sunrunner', recipe: ['pathfinder_token', 'sun_compass'], bonus: effect({ dayMaxRoll: 1 }), slotType: 'utility' },
  { id: 'night_shelter', name: 'Night Shelter', recipe: ['step_anchor', 'moon_ward'], bonus: effect({ nightDamageTakenReduction: 0.1 }), slotType: 'utility' },
  { id: 'bulwark_line', name: 'Bulwark Line', recipe: ['guard_crest', 'stable_edge'], bonus: effect({ maxHp: 20 }), slotType: 'combat' },
  { id: 'siege_heart', name: 'Siege Heart', recipe: ['guard_crest', 'power_edge'], bonus: effect({ dmgMax: 10 }), slotType: 'combat' },
  { id: 'hunter_guard', name: 'Hunter Guard', recipe: ['guard_crest', 'keen_eye'], bonus: effect({ critChance: 0.08 }), slotType: 'combat' },
  { id: 'last_stand', name: 'Last Stand', recipe: ['guard_crest', 'fatal_fang'], bonus: effect({ critDamage: 0.2 }), slotType: 'combat' },
  { id: 'iron_rhythm', name: 'Iron Rhythm', recipe: ['stable_edge', 'iron_guard'], bonus: effect({ blockChance: 0.08 }), slotType: 'combat' },
  { id: 'sustain_rhythm', name: 'Sustain Rhythm', recipe: ['stable_edge', 'blood_charm'], bonus: effect({ lifesteal: 0.06 }), slotType: 'combat' },
  { id: 'critical_burst', name: 'Critical Burst', recipe: ['power_edge', 'fatal_fang'], bonus: effect({ dmgMax: 10 }), slotType: 'combat' },
  { id: 'twin_reaper', name: 'Twin Reaper', recipe: ['twin_sigil', 'power_edge'], bonus: effect({ doubleStrike: 0.06 }), slotType: 'combat' },
  { id: 'death_mark', name: 'Death Mark', recipe: ['keen_eye', 'fatal_fang'], bonus: effect({ critChance: 0.08 }), slotType: 'combat' },
  { id: 'sunbreaker', name: 'Sunbreaker', recipe: ['sun_fang', 'keen_eye'], bonus: effect({ dayCritChance: 0.08 }), slotType: 'combat' }
];

export const OFFER_DYNAMIC_MULTIPLIERS = {
  existingNotMax: 2.0,
  familyBuildDirection: 1.5,
  lowHpRecovery: 1.7,
  daySun: 1.35,
  nightMoon: 1.5,
  alreadyHasFusionEndpoint: 1
};
