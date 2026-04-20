import { REWARD_TYPES } from '../shared/constants.js';

export const MYSTERY_REWARD_RULES = {
  outcomes: [REWARD_TYPES.hp, REWARD_TYPES.minDamage, REWARD_TYPES.maxDamage],
  oddsLocked: true,
  odds: {
    [REWARD_TYPES.hp]: 34,
    [REWARD_TYPES.minDamage]: 33,
    [REWARD_TYPES.maxDamage]: 33
  },
  notes: 'Locked by GDD v1.1.3 changelog.'
};
