export const RUNE_TRIAL_DAILY_REWARDED_WINS = 2;
export const RUNE_TRIAL_RESET_HOUR = 7;
export const RUNE_TRIAL_SAMPLE_STAGE_IDS = [1, 2, 3];

export const RUNE_TRIAL_STAGE_REWARD_BY_STAGE = {
  1: 7,
  2: 9,
  3: 10,
  4: 11,
  5: 12,
  6: 13,
  7: 14,
  8: 15,
  9: 16,
  10: 17,
  11: 18,
  12: 19,
  13: 20,
  14: 21,
  15: 22,
  16: 23,
  17: 24,
  18: 25,
  19: 26,
  20: 27
};

export const RUNE_TRIAL_SAMPLE_STAGES = {
  1: {
    id: 1,
    mapSize: { width: 6, height: 6 },
    playerStart: { x: 2, y: 4 },
    blockedCells: [{ x: 2, y: 2 }, { x: 3, y: 2 }],
    waves: [
      {
        enemyPlacements: [
          { enemyId: 'enemy_slime', enemyLevel: 1, position: { x: 1, y: 1 } },
          { enemyId: 'enemy_slime', enemyLevel: 1, position: { x: 4, y: 1 } }
        ]
      },
      {
        enemyPlacements: [
          { enemyId: 'enemy_wind', enemyLevel: 1, position: { x: 0, y: 1 } },
          { enemyId: 'enemy_wind', enemyLevel: 1, position: { x: 5, y: 1 } },
          { enemyId: 'enemy_slime', enemyLevel: 2, position: { x: 2, y: 0 } }
        ]
      }
    ]
  },
  2: {
    id: 2,
    mapSize: { width: 6, height: 6 },
    playerStart: { x: 3, y: 4 },
    blockedCells: [{ x: 1, y: 2 }, { x: 4, y: 2 }],
    waves: [
      {
        enemyPlacements: [
          { enemyId: 'enemy_slime', enemyLevel: 2, position: { x: 1, y: 1 } },
          { enemyId: 'enemy_wind', enemyLevel: 1, position: { x: 4, y: 1 } }
        ]
      },
      {
        enemyPlacements: [
          { enemyId: 'enemy_worm', enemyLevel: 2, position: { x: 2, y: 0 } },
          { enemyId: 'enemy_worm', enemyLevel: 2, position: { x: 3, y: 0 } },
          { enemyId: 'enemy_wind', enemyLevel: 2, position: { x: 5, y: 2 } }
        ]
      }
    ]
  },
  3: {
    id: 3,
    mapSize: { width: 6, height: 6 },
    playerStart: { x: 2, y: 4 },
    blockedCells: [{ x: 2, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 }],
    waves: [
      {
        enemyPlacements: [
          { enemyId: 'enemy_worm', enemyLevel: 2, position: { x: 0, y: 1 } },
          { enemyId: 'enemy_wind', enemyLevel: 2, position: { x: 5, y: 1 } }
        ]
      },
      {
        enemyPlacements: [
          { enemyId: 'enemy_fire', enemyLevel: 2, position: { x: 2, y: 0 } },
          { enemyId: 'enemy_fire', enemyLevel: 2, position: { x: 4, y: 0 } },
          { enemyId: 'enemy_worm', enemyLevel: 3, position: { x: 5, y: 2 } }
        ]
      }
    ]
  }
};

export function getRuneTrialStageReward(stageId) {
  return Number(RUNE_TRIAL_STAGE_REWARD_BY_STAGE[stageId] || 0);
}
