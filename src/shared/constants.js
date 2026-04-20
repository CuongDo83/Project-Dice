export const STORAGE_KEYS = {
  playerData: 'diceBoundPlayerData',
  totalGold: 'diceBoundTotalGold',
  enemyIntroSeen: 'dicebound_enemy_intro_seen_v1',
  playtestMap: 'dicebound_playtest_map'
};

export const SAVE_SCHEMA_VERSION = 1;

export const SCREENS = {
  home: 'home',
  gameplay: 'gameplay',
  combat: 'combat'
};

export const PHASES = {
  home: 'home',
  BeforeRoll: 'BeforeRoll',
  ReachablePreview: 'ReachablePreview',
  Moving: 'Moving',
  Combat: 'Combat',
  EnemyTurn: 'EnemyTurn',
  WinText: 'WinText',
  LoseText: 'LoseText'
};

export const OBJECTIVES = {
  defeatAll: 'defeat_all'
};

export const SPECIAL_CELL_TYPES = {
  lava: 'lava',
  swamp: 'swamp',
  canon: 'canon'
};

export const REWARD_TYPES = {
  hp: 'hp',
  minDamage: 'minDamage',
  maxDamage: 'maxDamage'
};
