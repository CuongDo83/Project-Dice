export const IDLE_REWARD_TICK_MS = 5 * 60 * 1000;
export const IDLE_REWARD_OFFLINE_CAP_MS = 4 * 60 * 60 * 1000;
export const IDLE_REWARD_EQUIPMENT_ROLL_CHANCE = 0.05;

export const IDLE_REWARD_GOLD_PER_TICK_BY_LEVEL = {
  1: 10,
  2: 15,
  3: 20,
  4: 25,
  5: 30,
  6: 35,
  7: 40,
  8: 45,
  9: 50,
  10: 55
};

export function getIdleGoldPerTickByMainLevel(level) {
  const safeLevel = Math.max(1, Math.min(10, Number(level || 1)));
  return Number(IDLE_REWARD_GOLD_PER_TICK_BY_LEVEL[safeLevel] || IDLE_REWARD_GOLD_PER_TICK_BY_LEVEL[1]);
}
