const ENEMY_ARCHETYPE_ROWS = [
  {
    archetype: 'enemy_slime',
    level: 1,
    hp: 40,
    dmgMin: 30,
    dmgMax: 40,
    moveSpeedMin: 1,
    moveSpeedMax: 1
  },
  {
    archetype: 'enemy_wind',
    level: 1,
    hp: 20,
    dmgMin: 20,
    dmgMax: 30,
    moveSpeedMin: 2,
    moveSpeedMax: 4
  },
  {
    archetype: 'enemy_worm',
    level: 1,
    hp: 60,
    dmgMin: 40,
    dmgMax: 50,
    moveSpeedMin: 2,
    moveSpeedMax: 2
  },
  {
    archetype: 'enemy_fire',
    level: 1,
    hp: 40,
    dmgMin: 50,
    dmgMax: 60,
    moveSpeedMin: 1,
    moveSpeedMax: 3
  }
];

const ENEMY_DISPLAY_META = {
  enemy_slime: {
    label: 'Slime',
    introText: 'Slime advances steadily with a fixed 1-tile move each enemy turn.',
    asset: './src/ui/assets/enemy-slime.png'
  },
  enemy_wind: {
    label: 'Wind',
    introText: 'Wind is the fast archetype and can surge several tiles in a single enemy turn.',
    asset: './src/ui/assets/enemy-wind.png'
  },
  enemy_worm: {
    label: 'Worm',
    introText: 'Worm is the tank archetype: durable, dangerous, and consistent at 2 tiles of speed.',
    asset: './src/ui/assets/enemy-worm.png'
  },
  enemy_fire: {
    label: 'Fire',
    introText: 'Fire is the high-threat attacker with volatile reach and the strongest damage baseline.',
    asset: './src/ui/assets/enemy-fire.png'
  }
};

function scaleEnemyStatsByLevel(row, level) {
  const safeLevel = Math.max(1, Number(level || 1));
  const hpGain = (safeLevel - 1) * 10;
  const dmgGain = Math.floor((safeLevel - 1) / 2) * 10;

  return {
    hp: row.hp + hpGain,
    dmgMin: row.dmgMin + dmgGain,
    dmgMax: row.dmgMax + dmgGain
  };
}

export function getEnemyConfig(archetype, level = 1) {
  const row = ENEMY_ARCHETYPE_ROWS.find((entry) => entry.archetype === archetype);

  if (!row) {
    throw new Error(`Unknown enemy archetype: ${archetype}`);
  }

  const scaled = scaleEnemyStatsByLevel(row, level);

  return {
    id: row.id || row.archetype,
    archetype: row.archetype,
    level: Math.max(1, Number(level || 1)),
    hp: scaled.hp,
    dmgMin: scaled.dmgMin,
    dmgMax: scaled.dmgMax,
    moveSpeedMin: row.moveSpeedMin,
    moveSpeedMax: row.moveSpeedMax
  };
}

export function listEnemyConfigs() {
  return ENEMY_ARCHETYPE_ROWS.map((row) => ({ ...row }));
}

export function getEnemyDisplayMeta(archetype) {
  return ENEMY_DISPLAY_META[archetype] || {
    label: archetype,
    introText: `${archetype} encountered.`,
    asset: './src/ui/assets/enemy-slime.png'
  };
}
