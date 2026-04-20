import { createRuntimeEnemiesFromPlacements } from '../content/level-generator.js';
import { loadLevel } from '../content/level-loader.js';
import {
  HEAL_POTION_HEAL_AMOUNT,
  HEAL_POTION_SPAWN_CHANCE,
  SLIME_HP_REFERENCE
} from '../data/balance-config.js';
import {
  applyDamageGuard,
  applyFusion,
  applyOfferToBag,
  buildOfferChoices,
  getBagItemCatalog,
  getOfferCardInfo,
  getBagTotalEffects,
  getBagView,
  getPlayerCombatStatsFromBag,
  getReadyFusions,
  swapOfferIntoBag
} from '../gameplay/battlefield-bag.js';
import { runCombat } from '../gameplay/combat.js';
import {
  activateAfterWinNextCombatBuff,
  buildEquipmentView,
  buildMergeRecipeSlots,
  equipOwnedPiece as equipOwnedPieceAction,
  unequipOwnedPiece as unequipOwnedPieceAction,
  consumeAfterWinNextCombatBuff,
  getOwnedPieceById,
  getEquipmentAttackModifiersForStrike,
  getEquipmentCombatStats,
  getEquipmentPostCombatBonuses,
  grantRandomTier1EquipmentDrop,
  mergeEquipmentTier,
  upgradeEquipmentSlot as upgradeEquipmentSlotAction,
  validateEquipmentMerge
} from '../gameplay/equipment.js';
import { advanceDayNightCycle, getEffectiveEnemyStats } from '../gameplay/day-night.js';
import { planEnemyTurn } from '../gameplay/enemy-turn.js';
import { findReachablePaths } from '../gameplay/pathfinding.js';
import { canExtendDraggedPath, getReachableDestinations, rollMoveDistance } from '../gameplay/movement.js';
import { isObjectiveComplete, isWaveCleared } from '../gameplay/objectives.js';
import { resolveSpecialCell } from '../gameplay/special-cells.js';
import {
  loadEconomy,
  loadPlaytestMapPayload,
  loadPlayerProfile,
  loadSeenEnemyIntros,
  applyProfileToPlayerStats,
  resetProgress as clearProgress,
  savePlayerProfile,
  saveSeenEnemyIntros,
  saveEconomy
} from '../persistence/save-store.js';
import { getGoldTechTreeBonuses } from '../data/gold-tech-tree-config.js';
import { calculateFinalRunGold, resolveEnemyGoldReward } from '../gameplay/economy.js';
import { buildGoldTechTreeView, buyGoldTechTreeNode } from '../gameplay/gold-tech-tree.js';
import {
  applyRuneTrialDailyReset,
  applyRuneTrialSweep,
  applyRuneTrialWin,
  buildRuneTrialRuntimeLevel,
  buildRuneTrialStageListView,
  getRuneTrialRemainingRewardedWins,
  getRuneTrialStageDefinition,
  isRuneTrialStageUnlocked
} from '../gameplay/rune-trial.js';
import { DAY_NIGHT_ROUND_LENGTH } from '../data/day-night-config.js';
import {
  IDLE_REWARD_EQUIPMENT_ROLL_CHANCE,
  IDLE_REWARD_OFFLINE_CAP_MS,
  IDLE_REWARD_TICK_MS,
  getIdleGoldPerTickByMainLevel
} from '../data/idle-reward-config.js';
import { PHASES, SCREENS } from '../shared/constants.js';
import { clonePosition, fromCoordKey, sameCoord, toCoordKey } from '../shared/coords.js';
import { createGameState, resetRunState } from './game-state.js';

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const EQUIPMENT_DROP_CHANCE = 0.2;

export async function createGameController(render) {
  const profile = loadPlayerProfile();
  const runtimeLevel = await loadLevel(profile.selectedMap || 'level-001', loadPlaytestMapPayload());
  const economy = loadEconomy();
  profile.gold = economy.totalGold;
  const gold = economy.totalGold;
  const seenEnemyIntros = loadSeenEnemyIntros();
  const state = createGameState(runtimeLevel, profile, gold, seenEnemyIntros);
  state.profile.idleReward = state.profile.idleReward || {
    lastAccruedAt: new Date().toISOString(),
    unclaimedGold: 0,
    pendingEquipmentRolls: 0
  };
  state.profile.runeProgress = applyRuneTrialDailyReset(state.profile.runeProgress);

  savePlayerProfile(profile);
  saveEconomy(economy);
  let rollAnnouncementTimer = null;
  let rollAnnouncementToken = 0;

  function ensureRuneTrialProgress() {
    const nextProgress = applyRuneTrialDailyReset(state.profile.runeProgress);
    state.profile.runeProgress = nextProgress;
    return nextProgress;
  }

  function ensureIdleRewardState() {
    const current = state.profile.idleReward || {};
    const safeLast = current.lastAccruedAt || new Date().toISOString();
    state.profile.idleReward = {
      lastAccruedAt: safeLast,
      unclaimedGold: Math.max(0, Number(current.unclaimedGold || 0)),
      pendingEquipmentRolls: Math.max(0, Math.floor(Number(current.pendingEquipmentRolls || 0)))
    };
    return state.profile.idleReward;
  }

  function getHighestClearedMainLevel() {
    const rawLevelId = String(state.mainRuntimeLevel?.id || '');
    const match = rawLevelId.match(/(\d+)/);
    if (!match) {
      return 1;
    }
    return Math.max(1, Math.min(10, Number(match[1] || 1)));
  }

  function accrueIdleReward(nowMs = Date.now()) {
    const idle = ensureIdleRewardState();
    const lastMs = Date.parse(idle.lastAccruedAt || '');
    const baseMs = Number.isFinite(lastMs) ? lastMs : nowMs;
    const elapsed = Math.max(0, nowMs - baseMs);
    const cappedElapsed = Math.min(elapsed, IDLE_REWARD_OFFLINE_CAP_MS);
    const ticks = Math.floor(cappedElapsed / IDLE_REWARD_TICK_MS);
    if (ticks <= 0) {
      return idle;
    }
    const highestMainLevel = getHighestClearedMainLevel();
    const goldPerTick = getIdleGoldPerTickByMainLevel(highestMainLevel);
    idle.unclaimedGold += ticks * goldPerTick;
    idle.pendingEquipmentRolls += ticks;
    const consumedMs = ticks * IDLE_REWARD_TICK_MS;
    const nextAccruedAtMs = elapsed > IDLE_REWARD_OFFLINE_CAP_MS
      ? nowMs
      : baseMs + consumedMs;
    idle.lastAccruedAt = new Date(nextAccruedAtMs).toISOString();
    state.profile.idleReward = idle;
    savePlayerProfile(state.profile);
    return idle;
  }

  function buildIdleRewardView() {
    const idle = ensureIdleRewardState();
    return {
      unclaimedGold: Math.max(0, Math.floor(idle.unclaimedGold || 0)),
      pendingEquipmentRolls: Math.max(0, Math.floor(idle.pendingEquipmentRolls || 0))
    };
  }

  function setRuneTrialToast(message) {
    state.runeTrialToast = message;
    renderState();
    window.setTimeout(() => {
      if (state.runeTrialToast === message) {
        state.runeTrialToast = null;
        renderState();
      }
    }, 1400);
  }

  function shouldShowEnemyThreatPreview() {
    return (
      state.screen === SCREENS.gameplay &&
      state.enemyThreatPreviewEnabled &&
      (state.phase === PHASES.BeforeRoll || state.phase === PHASES.ReachablePreview)
    );
  }

  function rebuildEnemyThreatPreview() {
    if (!shouldShowEnemyThreatPreview()) {
      state.enemyThreatPreview = null;
      return;
    }

    const darkKeys = new Set();
    const lightKeys = new Set();
    const enemies = state.enemies.filter((enemy) => enemy.alive);

    enemies.forEach((enemy) => {
      const blockedEnemyKeys = new Set(
        enemies
          .filter((other) => other.id !== enemy.id)
          .map((other) => toCoordKey(other.currentPosition))
      );
      const playerKey = toCoordKey(state.player.position);
      const effectiveStats = getEffectiveEnemyStats(enemy, state.dayNight);
      const minRange = Math.max(0, Number(effectiveStats.moveSpeedMin || 0));
      const maxRange = Math.max(minRange, Number(effectiveStats.moveSpeedMax || minRange));
      const maxPaths = findReachablePaths(
        state.runtimeLevel,
        enemy.currentPosition,
        maxRange,
        (position) => {
          const key = toCoordKey(position);
          if (key === playerKey) {
            return true;
          }
          return !blockedEnemyKeys.has(key);
        }
      );

      maxPaths.forEach((path, key) => {
        const distance = Math.max(0, path.length - 1);
        if (distance <= 0) {
          return;
        }
        if (distance <= minRange) {
          darkKeys.add(key);
          return;
        }
        if (distance <= maxRange) {
          lightKeys.add(key);
        }
      });
    });

    darkKeys.forEach((key) => lightKeys.delete(key));
    state.enemyThreatPreview = {
      darkKeys,
      lightKeys
    };
  }

  function scheduleRollAnnouncement(value) {
    rollAnnouncementToken += 1;
    const token = rollAnnouncementToken;
    state.rollAnnouncement = String(value);

    if (rollAnnouncementTimer) {
      window.clearTimeout(rollAnnouncementTimer);
    }

    rollAnnouncementTimer = window.setTimeout(() => {
      if (token !== rollAnnouncementToken) {
        return;
      }
      state.rollAnnouncement = null;
      renderState();
    }, 2000);
  }

  function renderState() {
    accrueIdleReward();
    const runeProgress = ensureRuneTrialProgress();
    state.goldTechTreeView = buildGoldTechTreeView(state.profile.goldTechTree, runeProgress.runeShardBalance);
    state.runeTrialView = {
      runeShardBalance: runeProgress.runeShardBalance,
      highestClearedStage: runeProgress.highestClearedStage,
      remainingRewardedWins: getRuneTrialRemainingRewardedWins(runeProgress),
      stages: buildRuneTrialStageListView(runeProgress)
    };
    state.idleRewardView = buildIdleRewardView();
    state.equipmentView = buildEquipmentView(state.profile.equipment, state.gold);
    if (state.modal?.type === 'equipmentItemInfo') {
      const piece = state.equipmentView?.ownedPieces?.find((entry) => entry.id === state.modal.pieceId);
      if (!piece) {
        state.modal = null;
      } else {
        const slotView = state.equipmentView?.slots?.find((slot) => slot.slot === piece.slot) || null;
        state.modal = {
          ...state.modal,
          slot: piece.slot,
          slotView
        };
      }
    }
    if (state.equipmentBlacksmith?.rootPieceId) {
      const rootPiece = getOwnedPieceById(state.profile.equipment, state.equipmentBlacksmith.rootPieceId);
      if (!rootPiece) {
        state.equipmentBlacksmith = null;
      } else {
        const validation = validateEquipmentMerge({
          equipmentSave: state.profile.equipment,
          rootPieceId: state.equipmentBlacksmith.rootPieceId,
          materialPieceIds: state.equipmentBlacksmith.materialPieceIds
        });
        state.equipmentBlacksmith.recipeSlots = buildMergeRecipeSlots(rootPiece);
        state.equipmentBlacksmith.mergeCost = validation.ok ? validation.cost : 0;
        state.equipmentBlacksmith.mergeReady = validation.ok;
      }
    }
    syncWavePreviewMarkers();
    rebuildEnemyThreatPreview();
    render(state, actions);
  }

  function setHomeState(message) {
    if (rollAnnouncementTimer) {
      window.clearTimeout(rollAnnouncementTimer);
      rollAnnouncementTimer = null;
    }
    rollAnnouncementToken += 1;
    state.screen = SCREENS.home;
    state.homeView = 'main';
    state.runMode = 'main';
    state.activeRuneTrialStageId = null;
    state.runtimeLevel = state.mainRuntimeLevel;
    state.phase = PHASES.home;
    state.modal = null;
    state.reachablePaths = new Map();
    state.rolledMove = null;
    state.dragPath = [];
    state.dragPreviewText = '';
    state.isDraggingPath = false;
    state.healPotions = [];
    state.waveWarning = null;
    state.phaseCue = '';
    state.rollAnnouncement = null;
    state.enemyRollPreview = null;
    state.enemyThreatPreview = null;
    state.enemyTooltipEnemyId = null;
    state.runGoldBase = 0;
    state.runResultTable = null;
    state.rewardFlyDrops = [];
    state.hudBagPulse = false;
    state.equipmentBlacksmith = null;
    state.equipmentToast = null;
    state.runeTrialToast = null;
    state.message = message;
    renderState();
  }

  function settleRunGoldToEconomy() {
    const totalGoldEfficiencyBonus = getGoldTechTreeBonuses(state.profile.goldTechTree).goldEfficiency;
    const finalRunGold = calculateFinalRunGold(state.runGoldBase, totalGoldEfficiencyBonus);

    economy.earnedThisRun = finalRunGold;
    economy.totalGold += finalRunGold;
    state.gold = economy.totalGold;
    state.profile.gold = state.gold;
    saveEconomy(economy);
    savePlayerProfile(state.profile);

    const baseGold = state.runGoldBase;
    state.runGoldBase = 0;

    return {
      baseGold,
      finalRunGold,
      totalGoldEfficiencyBonus
    };
  }

  function pushRunReward(text) {
    if (!text) {
      return;
    }
    if (!state.runStats?.rewards) {
      state.runStats = {
        enemiesKilled: Number(state.runStats?.enemiesKilled || 0),
        rewards: [],
        equipmentObtained: [...(state.runStats?.equipmentObtained || [])]
      };
    }
    state.runStats.rewards.push(text);
  }

  function pushRunEquipmentObtained(text) {
    if (!text) {
      return;
    }
    if (!Array.isArray(state.runStats?.equipmentObtained)) {
      state.runStats.equipmentObtained = [];
    }
    state.runStats.equipmentObtained.push(text);
  }

  function triggerHudBagPulse() {
    state.hudBagPulse = true;
    renderState();
    window.setTimeout(() => {
      state.hudBagPulse = false;
      renderState();
    }, 320);
  }

  async function playRewardFlyDropSequence(origin, drops) {
    if (!Array.isArray(drops) || drops.length === 0) {
      return;
    }
    const createdAt = Date.now();
    state.rewardFlyDrops = drops.map((drop, index) => ({
      id: `${createdAt}_${index}`,
      type: drop.type,
      label: drop.label,
      origin: { ...origin },
      phase: 'jump'
    }));
    renderState();
    await wait(500);

    state.rewardFlyDrops = state.rewardFlyDrops.map((drop) => ({
      ...drop,
      phase: 'fly'
    }));
    renderState();
    await wait(650);
    state.rewardFlyDrops = [];
    triggerHudBagPulse();
    renderState();
  }

  function buildRunResultTable(result, tally) {
    return {
      result,
      enemiesKilled: Number(state.runStats?.enemiesKilled || 0),
      goldEarned: Number(tally?.finalRunGold || 0),
      equipmentObtained: [...(state.runStats?.equipmentObtained || [])]
    };
  }

  function showRunResultTable(result, tally) {
    return new Promise((resolve) => {
      state.runResultTable = buildRunResultTable(result, tally);
      state.modal = {
        type: 'runResult',
        onClose: () => {
          state.modal = null;
          resolve();
        }
      };
      renderState();
    });
  }

  async function showResultText(text) {
    state.resultText = text;
    renderState();
    await wait(1200);
    state.resultText = null;
    renderState();
  }

  async function showEnemyIntroIfNeeded(enemy) {
    if (state.seenEnemyIntros.has(enemy.archetype)) {
      return;
    }

    await new Promise((resolve) => {
      state.modal = {
        type: 'enemyIntro',
        enemy,
        onClose: () => {
          state.modal = null;
          state.seenEnemyIntros.add(enemy.archetype);
          saveSeenEnemyIntros(state.seenEnemyIntros);
          renderState();
          resolve();
        }
      };
      renderState();
    });
  }

  function removeEnemy(enemyId) {
    state.enemies = state.enemies.map((enemy) => {
      if (enemy.id !== enemyId) {
        return enemy;
      }

      return {
        ...enemy,
        alive: false,
        currentHp: 0
      };
    });
  }

  function getPlayerHealthRatio() {
    if (state.player.hp.max <= 0) {
      return 0;
    }
    return state.player.hp.current / state.player.hp.max;
  }

  function getProgressRatio() {
    if (state.totalWaves <= 1) {
      return 1;
    }
    return state.currentWaveIndex / (state.totalWaves - 1);
  }

  function refreshPlayerRuntimeStatsFromBag() {
    const effects = state.runMode === 'runeTrial'
      ? getBagTotalEffects(createBattlefieldBag(), 'Day')
      : getBagTotalEffects(state.battlefieldBag, state.dayNight.phase);
    const oldMaxHp = state.player.hp.max;
    const nextMaxHp = Math.max(1, state.player.base.hp + effects.maxHp);
    const hpDelta = nextMaxHp - oldMaxHp;
    state.player.hp.max = nextMaxHp;
    if (hpDelta > 0) {
      state.player.hp.current = Math.min(nextMaxHp, state.player.hp.current + hpDelta);
    } else {
      state.player.hp.current = Math.min(nextMaxHp, state.player.hp.current);
    }

    const dmg = applyDamageGuard(
      state.player.base.dmgMin,
      state.player.base.dmgMax,
      effects.dmgMin,
      effects.dmgMax,
      SLIME_HP_REFERENCE
    );
    state.player.dmg.min = dmg.min;
    state.player.dmg.max = dmg.max;
    state.player.moveMin = Math.max(1, state.player.base.moveMin + effects.minRoll);
    state.player.moveMax = Math.max(state.player.moveMin, state.player.base.moveMax + effects.maxRoll);
    state.player.healEfficiency = effects.healEfficiency;
    state.player.combatStats = getPlayerCombatStatsFromBag(effects);
    state.player.postCombatHeal = 0;

    const equipmentCombatStats = getEquipmentCombatStats(state.profile.equipment, {
      isNight: state.dayNight.phase === 'Night',
      afterWinNextCombatActive: state.equipmentRuntime?.afterWinNextCombatActive
    });
    state.player.combatStats.critChance += equipmentCombatStats.critChance || 0;
    state.player.combatStats.blockChance += equipmentCombatStats.blockChance || 0;
    state.player.combatStats.lifesteal += equipmentCombatStats.lifesteal || 0;
    state.player.combatStats.doubleStrike += equipmentCombatStats.doubleStrike || 0;
    state.player.combatStats.nightDamageTakenReduction += equipmentCombatStats.nightDamageTakenReduction || 0;
    state.player.postCombatHeal += equipmentCombatStats.postCombatHeal || 0;
  }

  function syncPlayerBaseFromProfile() {
    const stats = applyProfileToPlayerStats(state.runtimeLevel.playerStats, state.profile);
    state.player.base.hp = stats.hp;
    state.player.base.dmgMin = stats.dmgMin;
    state.player.base.dmgMax = stats.dmgMax;
    state.player.base.moveMin = stats.moveMin;
    state.player.base.moveMax = stats.moveMax;
    if (state.screen === SCREENS.home) {
      state.player.hp.current = stats.hp;
      state.player.hp.max = stats.hp;
      state.player.dmg.min = stats.dmgMin;
      state.player.dmg.max = stats.dmgMax;
      state.player.moveMin = stats.moveMin;
      state.player.moveMax = stats.moveMax;
    }
  }

  function showEquipmentToast(message) {
    state.equipmentToast = message;
    renderState();
    window.setTimeout(() => {
      if (state.equipmentToast === message) {
        state.equipmentToast = null;
        renderState();
      }
    }, 1500);
  }

  function openEquipmentItemInfoModal(pieceId) {
    if (state.screen !== SCREENS.home || state.homeView !== 'equipment') {
      return;
    }
    const piece = state.equipmentView?.ownedPieces?.find((entry) => entry.id === pieceId);
    if (!piece) {
      return;
    }
    const slotView = state.equipmentView?.slots?.find((slot) => slot.slot === piece.slot);
    state.modal = {
      type: 'equipmentItemInfo',
      pieceId: piece.id,
      slot: piece.slot,
      slotView
    };
  }

  function openBattlefieldBagOfferModal({ sourceLabel }) {
    return new Promise((resolve) => {
      let currentOffers = buildOfferChoices({
        bag: state.battlefieldBag,
        playerHpRatio: getPlayerHealthRatio(),
        dayNightPhase: state.dayNight.phase,
        progressRatio: getProgressRatio()
      });

      function renderOffer() {
        state.modal = {
          type: 'battlefieldBagOffer',
          sourceLabel,
          rerollRemaining: state.bagRerollRemaining,
          offers: currentOffers.map((entry) => ({
            ...entry,
            item: getBagItemCatalog(entry.itemId),
            cardInfo: getOfferCardInfo({ bag: state.battlefieldBag, itemId: entry.itemId })
          })),
          bagView: getBagView(state.battlefieldBag),
          onSelectOffer(itemId) {
            const isNewItem = !state.battlefieldBag.slots.some(
              (entry) => entry?.itemId === itemId && !entry.isFusion
            );
            const result = applyOfferToBag(state.battlefieldBag, itemId, {
              allowSwapWhenNotFullForNew: isNewItem
            });
            if (result.requiresSwap) {
              renderSwap(itemId, {
                allowEmptySlots: Boolean(result.allowEmptySlotSwap)
              });
              return;
            }
            refreshPlayerRuntimeStatsFromBag();
            if (result.applied) {
              pushRunReward(result.message);
            }
            state.modal = null;
            resolve(result);
          },
          onSkipOffer() {
            state.modal = null;
            resolve({
              applied: false,
              message: 'Skipped battlefield bag pick.'
            });
          },
          onRerollOffer() {
            if (state.bagRerollRemaining <= 0) {
              return;
            }
            state.bagRerollRemaining -= 1;
            currentOffers = buildOfferChoices({
              bag: state.battlefieldBag,
              playerHpRatio: getPlayerHealthRatio(),
              dayNightPhase: state.dayNight.phase,
              progressRatio: getProgressRatio()
            });
            renderOffer();
          }
        };
        renderState();
      }

      function renderSwap(itemId, { allowEmptySlots = false } = {}) {
        state.modal = {
          type: 'battlefieldBagSwap',
          item: getBagItemCatalog(itemId),
          bagView: getBagView(state.battlefieldBag),
          allowEmptySlots,
          onSwap(slotIndex) {
            const result = swapOfferIntoBag(state.battlefieldBag, itemId, slotIndex);
            refreshPlayerRuntimeStatsFromBag();
            if (result.applied) {
              pushRunReward(result.message);
            }
            state.modal = null;
            resolve(result);
          },
          onCancel() {
            state.modal = null;
            resolve({
              applied: false,
              message: allowEmptySlots
                ? 'Skipped placing the new item.'
                : 'Skipped item because bag is full.'
            });
          }
        };
        renderState();
      }

      renderOffer();
    });
  }

  function openFusionModal(fusions) {
    return new Promise((resolve) => {
      state.modal = {
        type: 'battlefieldBagFusion',
        fusions,
        onFuse(fusionId) {
          const result = applyFusion(state.battlefieldBag, fusionId);
          refreshPlayerRuntimeStatsFromBag();
          if (result.applied) {
            pushRunReward(result.message);
          }
          state.modal = null;
          resolve(result);
        },
        onSkip() {
          state.modal = null;
          resolve({
            applied: false,
            message: 'Fusion skipped.'
          });
        }
      };
      renderState();
    });
  }

  function getOrthogonalNeighbors(position) {
    return [
      { x: position.x + 1, y: position.y },
      { x: position.x - 1, y: position.y },
      { x: position.x, y: position.y + 1 },
      { x: position.x, y: position.y - 1 }
    ];
  }

  function spawnHealPotionFromEnemy(enemyPosition) {
    if (Math.random() > HEAL_POTION_SPAWN_CHANCE) {
      return false;
    }

    const validTiles = getOrthogonalNeighbors(enemyPosition)
      .filter((candidate) => state.runtimeLevel.walkableKeys.has(toCoordKey(candidate)))
      .filter((candidate) => !state.enemies.some((entry) => entry.alive && sameCoord(entry.currentPosition, candidate)))
      .filter((candidate) => !state.healPotions.some((potion) => sameCoord({ x: potion.x, y: potion.y }, candidate)));

    if (validTiles.length === 0) {
      return false;
    }

    const chosenTile = validTiles[Math.floor(Math.random() * validTiles.length)];
    state.healPotions.push({
      id: `heal_${Date.now()}_${chosenTile.x}_${chosenTile.y}`,
      x: chosenTile.x,
      y: chosenTile.y
    });

    return true;
  }

  function tryPickupHealPotion(position) {
    const potionIndex = state.healPotions.findIndex((potion) => sameCoord({ x: potion.x, y: potion.y }, position));
    if (potionIndex < 0) {
      return false;
    }

    state.healPotions.splice(potionIndex, 1);
    const healAmount = HEAL_POTION_HEAL_AMOUNT + (state.player.healEfficiency || 0);
    state.player.hp.current = Math.min(state.player.hp.max, state.player.hp.current + healAmount);
    state.message = `Picked heal potion (+${healAmount} HP).`;
    return true;
  }

  async function resolveBattlefieldBagRewardFlow(sourceLabel) {
    const pickResult = await openBattlefieldBagOfferModal({ sourceLabel });
    state.message = pickResult.message;
    renderState();
    await wait(180);

    while (true) {
      const fusions = getReadyFusions(state.battlefieldBag);
      if (fusions.length === 0) {
        break;
      }
      const fusionResult = await openFusionModal(fusions);
      if (!fusionResult.applied) {
        break;
      }
      state.message = fusionResult.message;
      renderState();
      await wait(160);
    }
  }

  async function resolveEnemyDeathRewards(enemy) {
    const enemyGold = resolveEnemyGoldReward(enemy);
    state.runGoldBase += enemyGold;
    const potionSpawned = spawnHealPotionFromEnemy(enemy.currentPosition);
    await resolveBattlefieldBagRewardFlow('Enemy Drop');

    const drops = [
      {
        type: 'gold',
        label: `+${enemyGold}`
      }
    ];

    let equipmentDropResult = null;
    if (Math.random() < EQUIPMENT_DROP_CHANCE) {
      equipmentDropResult = grantRandomTier1EquipmentDrop(state.profile.equipment);
      if (equipmentDropResult.ok) {
        drops.push({
          type: 'equipment',
          label: equipmentDropResult.piece.name
        });
      }
    }

    await playRewardFlyDropSequence(enemy.currentPosition, drops);

    if (equipmentDropResult?.ok) {
      state.profile.equipment = equipmentDropResult.nextSave;
      savePlayerProfile(state.profile);
      syncPlayerBaseFromProfile();
      refreshPlayerRuntimeStatsFromBag();
      pushRunReward(`Equipment drop: ${equipmentDropResult.piece.name} (T1)`);
      pushRunEquipmentObtained(`${equipmentDropResult.piece.name} (T1)`);
    }

    const rewardParts = [`${enemy.label} defeated (+${enemyGold} gold base).`];
    if (potionSpawned) {
      rewardParts.push('Heal potion dropped nearby.');
      pushRunReward('Heal potion dropped nearby.');
      renderState();
      await wait(220);
    }
    state.message = rewardParts.join(' ');
  }

  function spawnWaveEnemiesByIndex(waveIndex) {
    const wave = state.runtimeLevel.waves?.[waveIndex];
    if (!wave) {
      return [];
    }

    const spawnedEnemies = createRuntimeEnemiesFromPlacements(wave.enemyPlacements);
    state.enemies = [...state.enemies, ...spawnedEnemies];
    state.currentWaveIndex = waveIndex;
    return spawnedEnemies;
  }

  function spawnWaveMysteryCellsByIndex(waveIndex) {
    const wave = state.runtimeLevel.waves?.[waveIndex];
    if (!wave) {
      return [];
    }

    const knownMysteryIds = new Set(state.runtimeLevel.mysteryCells.map((cell) => cell.id));
    const spawnedMystery = [];
    wave.mysteryCells.forEach((cell) => {
      if (!knownMysteryIds.has(cell.id)) {
        const entry = {
          ...cell,
          consumed: false
        };
        state.runtimeLevel.mysteryCells.push(entry);
        spawnedMystery.push(entry);
      }
    });
    return spawnedMystery;
  }

  function hasMoreWaves() {
    return state.currentWaveIndex < state.totalWaves - 1;
  }

  function buildWarningSpawnPositions(nextWaveIndex) {
    const nextWave = state.runtimeLevel.waves?.[nextWaveIndex];
    if (!nextWave) {
      return [];
    }

    const uniqueByKey = new Map();
    nextWave.enemyPlacements.forEach((placement) => {
      uniqueByKey.set(toCoordKey(placement.position), { ...placement.position });
    });

    return [...uniqueByKey.values()];
  }

  function buildWarningMysteryPositions(nextWaveIndex) {
    const nextWave = state.runtimeLevel.waves?.[nextWaveIndex];
    if (!nextWave) {
      return [];
    }

    const uniqueByKey = new Map();
    nextWave.mysteryCells.forEach((cell) => {
      uniqueByKey.set(toCoordKey(cell), { x: cell.x, y: cell.y });
    });
    return [...uniqueByKey.values()];
  }

  function syncWavePreviewMarkers() {
    if (state.screen !== SCREENS.gameplay || !hasMoreWaves()) {
      state.waveWarning = null;
      return;
    }
    if (state.runMode !== 'main') {
      return;
    }
    if (state.turnCounter <= 1) {
      state.waveWarning = null;
      return;
    }
    const isNightWindowBeforeNextDayBlock = state.dayNight?.phase === 'Night';
    const isFirstDayTurnWindow = (
      state.dayNight?.phase === 'Day' &&
      Number(state.dayNight?.remainingRoundsInPhase || 0) === DAY_NIGHT_ROUND_LENGTH.Day
    );
    if (!isNightWindowBeforeNextDayBlock && !isFirstDayTurnWindow) {
      state.waveWarning = null;
      return;
    }
    const nextWaveIndex = state.currentWaveIndex + 1;
    state.waveWarning = {
      active: true,
      nextWaveIndex,
      spawnPositions: buildWarningSpawnPositions(nextWaveIndex),
      mysterySpawnPositions: buildWarningMysteryPositions(nextWaveIndex)
    };
  }

  async function spawnScheduledWaveAtDayTurnStart() {
    if (state.runMode !== 'main') {
      return null;
    }
    if (state.screen !== SCREENS.gameplay || !hasMoreWaves()) {
      return null;
    }
    if (state.dayNight?.phase !== 'Day') {
      return null;
    }
    if (Number(state.dayNight?.remainingRoundsInPhase || 0) !== DAY_NIGHT_ROUND_LENGTH.Day) {
      return null;
    }

    const nextWaveIndex = state.currentWaveIndex + 1;
    const spawnedMystery = spawnWaveMysteryCellsByIndex(nextWaveIndex);
    const spawnedEnemies = spawnWaveEnemiesByIndex(nextWaveIndex);

    for (const mysteryCell of spawnedMystery) {
      if (sameCoord({ x: mysteryCell.x, y: mysteryCell.y }, state.player.position) && !mysteryCell.consumed) {
        mysteryCell.consumed = true;
        await resolveBattlefieldBagRewardFlow('Wave Spawn Mystery');
      }
    }

    const immediateAttackers = spawnedEnemies.filter((enemy) => sameCoord(enemy.currentPosition, state.player.position));
    for (const enemy of immediateAttackers) {
      await showEnemyIntroIfNeeded(enemy);
      const survived = await runEncounter(enemy, 'enemy');
      if (!survived) {
        return {
          nextWaveIndex,
          playerDefeated: true
        };
      }
    }

    return {
      nextWaveIndex,
      playerDefeated: false
    };
  }

  function getPathPreviewText(path) {
    if (path.length === 0) {
      return 'Drag a path then release to commit.';
    }

    const firstEnemyStep = path.find((step) =>
      state.enemies.some((enemy) => enemy.alive && sameCoord(enemy.currentPosition, step))
    );

    const mysteryCount = path.filter((step) =>
      state.runtimeLevel.mysteryCells.some((cell) => !cell.consumed && sameCoord({ x: cell.x, y: cell.y }, step))
    ).length;

    const potionCount = path.filter((step) =>
      state.healPotions.some((potion) => sameCoord({ x: potion.x, y: potion.y }, step))
    ).length;

    const segments = [`Path ${path.length}/${state.rolledMove}`];
    if (firstEnemyStep) {
      segments.push('combat preview');
    }
    if (mysteryCount > 0) {
      segments.push(`mystery x${mysteryCount}`);
    }
    if (potionCount > 0) {
      segments.push(`heal x${potionCount}`);
    }

    return segments.join(' | ');
  }

  async function handleLose() {
    state.screen = SCREENS.gameplay;
    state.phase = PHASES.LoseText;
    state.modal = null;
    renderState();
    await showResultText('LOSE');
    if (state.runMode === 'runeTrial') {
      state.homeView = 'modes';
      state.screen = SCREENS.home;
      state.activeRuneTrialStageId = null;
      state.runtimeLevel = state.mainRuntimeLevel;
      state.phase = PHASES.home;
      state.message = 'Rune Trial failed. Rewarded wins were not consumed.';
      renderState();
      return;
    }
    const tally = settleRunGoldToEconomy();
    await showRunResultTable('Lose', tally);
    resetRunState(state);
    state.healPotions = [];
    setHomeState(
      `Lose flow finished. Run gold: ${tally.baseGold} base, +${Math.round(tally.totalGoldEfficiencyBonus * 100)}% efficiency, final +${tally.finalRunGold}.`
    );
  }

  async function handleWin() {
    state.screen = SCREENS.gameplay;
    state.phase = PHASES.WinText;
    state.modal = null;
    renderState();
    await showResultText('WIN');
    if (state.runMode === 'runeTrial') {
      const stageId = Number(state.activeRuneTrialStageId || 0);
      const winResult = applyRuneTrialWin(ensureRuneTrialProgress(), stageId);
      state.profile.runeProgress = winResult.nextProgress;
      savePlayerProfile(state.profile);
      state.homeView = 'runeTrialStages';
      state.screen = SCREENS.home;
      state.activeRuneTrialStageId = null;
      state.runtimeLevel = state.mainRuntimeLevel;
      state.phase = PHASES.home;
      state.message = winResult.rewarded
        ? `Rune Trial clear. +${winResult.reward} Rune Shard.`
        : 'Rune Trial clear, but no rewarded wins remained.';
      renderState();
      return;
    }
    const tally = settleRunGoldToEconomy();
    await showRunResultTable('Win', tally);
    setHomeState(
      `Level clear. Run gold: ${tally.baseGold} base, +${Math.round(tally.totalGoldEfficiencyBonus * 100)}% efficiency, final +${tally.finalRunGold}. Next: power-up selection.`
    );
  }

  async function resolveRuneTrialWaveTransitionIfNeeded() {
    if (state.runMode !== 'runeTrial') {
      return true;
    }
    if (!hasMoreWaves()) {
      state.waveWarning = null;
      return true;
    }
    if (!isWaveCleared(state.enemies)) {
      return true;
    }
    const nextWaveIndex = state.currentWaveIndex + 1;
    state.waveWarning = {
      active: true,
      nextWaveIndex,
      spawnPositions: buildWarningSpawnPositions(nextWaveIndex),
      mysterySpawnPositions: []
    };
    state.message = `Wave ${nextWaveIndex + 1}/${state.totalWaves} incoming.`;
    renderState();
    await wait(320);
    const spawnedEnemies = spawnWaveEnemiesByIndex(nextWaveIndex);
    state.waveWarning = null;
    renderState();
    await wait(80);

    const immediateAttackers = spawnedEnemies.filter((enemy) => sameCoord(enemy.currentPosition, state.player.position));
    for (const enemy of immediateAttackers) {
      await showEnemyIntroIfNeeded(enemy);
      const survived = await runEncounter(enemy, 'enemy');
      if (!survived) {
        return false;
      }
    }
    return true;
  }

  async function runEncounter(enemy, initiator) {
    const afterWinNextCombatActive = Boolean(state.equipmentRuntime?.afterWinNextCombatActive);
    if (afterWinNextCombatActive) {
      state.equipmentRuntime = consumeAfterWinNextCombatBuff(state.equipmentRuntime);
    }
    const effectiveEnemyStats = getEffectiveEnemyStats(enemy, state.dayNight);
    const combatEnemy = {
      ...enemy,
      dmgMin: effectiveEnemyStats.dmgMin,
      dmgMax: effectiveEnemyStats.dmgMax
    };
    state.lastCombatEnemy = {
      ...combatEnemy
    };
    state.screen = SCREENS.combat;
    state.phase = PHASES.Combat;
    state.modal = {
      type: 'combat',
      enemy: combatEnemy,
      log: [`${initiator === 'player' ? 'Player' : enemy.label} attacks first.`],
      animation: {
        actor: null,
        target: null,
        phase: 'idle',
        damage: null
      }
    };
    renderState();

    const result = await runCombat({
      player: state.player,
      enemy: combatEnemy,
      initiator,
      playerCombatStats: state.player.combatStats,
      enemyCombatStats: {},
      getPlayerAttackRuntimeStats({ attackIndex, enemyCurrentHp, enemyMaxHp }) {
        const runtimeStats = getEquipmentAttackModifiersForStrike(state.profile.equipment, {
          isNight: state.dayNight.phase === 'Night',
          afterWinNextCombatActive,
          isFirstHit: attackIndex === 0,
          enemyBelowHalf: enemyMaxHp > 0 ? enemyCurrentHp / enemyMaxHp < 0.5 : false
        });
        return runtimeStats;
      },
      wait,
      onUpdate(animationState) {
        state.lastCombatEnemy = {
          ...combatEnemy
        };
        state.modal = {
          type: 'combat',
          enemy: combatEnemy,
          log: animationState.log,
          animation: {
            actor: animationState.actor,
            target: animationState.target,
            phase: animationState.phase,
            damage: animationState.damage
          }
        };
        renderState();
      }
    });

    if (result.winner === 'player') {
      const postCombatStats = getEquipmentPostCombatBonuses(state.profile.equipment, {
        isNight: state.dayNight.phase === 'Night',
        justWonCombat: true
      });
      const totalPostCombatHeal = Math.max(0, Math.floor(postCombatStats.postCombatHeal || 0));
      if (totalPostCombatHeal > 0) {
        const beforeHeal = state.player.hp.current;
        state.player.hp.current = Math.min(state.player.hp.max, state.player.hp.current + totalPostCombatHeal);
        const healed = state.player.hp.current - beforeHeal;
        if (healed > 0) {
          result.log.push(`Equipment post-combat heal: +${healed} HP.`);
        }
      }

      state.equipmentRuntime = activateAfterWinNextCombatBuff(state.equipmentRuntime);
      if (state.runMode === 'main') {
        const enemyGold = resolveEnemyGoldReward(enemy);
        result.log.push(`Gold reward from ${enemy.label}: +${enemyGold} (base).`);
      }
    }

    await new Promise((resolve) => {
      state.modal = {
        type: 'combat',
        enemy: combatEnemy,
        log: result.log,
        animation: {
          actor: null,
          target: null,
          phase: 'idle',
          damage: null
        },
        awaitingContinue: true,
        onClose: () => {
          state.modal = null;
          resolve();
        }
      };
      renderState();
    });

    state.screen = SCREENS.gameplay;
    enemy.currentHp = combatEnemy.currentHp;
    renderState();

    if (result.winner === 'player') {
      state.runStats.enemiesKilled = Number(state.runStats.enemiesKilled || 0) + 1;
      removeEnemy(enemy.id);
      if (state.runMode === 'main') {
        await resolveEnemyDeathRewards(enemy);
      }
      const keepPlaying = await resolveRuneTrialWaveTransitionIfNeeded();
      if (!keepPlaying) {
        return false;
      }
      renderState();
      await wait(300);
      return true;
    }

    await handleLose();
    return false;
  }

  async function resolveLandingCell(position) {
    if (state.runMode === 'main') {
      const specialResult = resolveSpecialCell(position, state);
      if (specialResult.message) {
        state.message = specialResult.message;
        renderState();
        await wait(300);
      }
    }

    const enemy = state.enemies.find((entry) => entry.alive && sameCoord(entry.currentPosition, position));
    if (enemy) {
      await showEnemyIntroIfNeeded(enemy);
      const survived = await runEncounter(enemy, 'player');
      if (!survived) {
        return false;
      }
    }

    if (state.runMode === 'main') {
      const mysteryCell = state.runtimeLevel.mysteryCells.find(
        (cell) => !cell.consumed && sameCoord({ x: cell.x, y: cell.y }, position)
      );
      if (mysteryCell) {
        mysteryCell.consumed = true;
        await resolveBattlefieldBagRewardFlow('Mystery Cell');
      }

      if (tryPickupHealPotion(position)) {
        renderState();
        await wait(200);
      }
    }

    return true;
  }

  async function executeEnemyTurn() {
    state.phase = PHASES.EnemyTurn;
    state.rolledMove = null;
    state.reachablePaths = new Map();
    state.message = 'Enemy turn resolves sequentially.';
    renderState();
    await wait(300);

    for (const enemy of [...state.enemies]) {
      const activeEnemy = state.enemies.find((entry) => entry.id === enemy.id && entry.alive);
      if (!activeEnemy || activeEnemy.currentHp <= 0) {
        continue;
      }

      const effectiveStats = getEffectiveEnemyStats(activeEnemy, state.dayNight);
      const rolledSpeed = effectiveStats.moveSpeedMin + Math.floor(
        Math.random() * (effectiveStats.moveSpeedMax - effectiveStats.moveSpeedMin + 1)
      );
      state.enemyRollPreview = {
        enemyId: activeEnemy.id,
        value: rolledSpeed
      };
      renderState();
      await wait(500);
      state.enemyRollPreview = null;

      const plan = planEnemyTurn(state.runtimeLevel, activeEnemy, state.player, state.enemies, rolledSpeed);
      state.message = `${activeEnemy.label} moves ${plan.speed} step(s).`;
      renderState();
      await wait(250);

      for (const step of plan.steps || []) {
        activeEnemy.currentPosition = clonePosition(step);
        renderState();
        await wait(220);

        if (sameCoord(activeEnemy.currentPosition, state.player.position)) {
          await showEnemyIntroIfNeeded(activeEnemy);
          const survived = await runEncounter(activeEnemy, 'enemy');
          if (!survived) {
            return;
          }
          break;
        }
      }
    }

    if (isObjectiveComplete(state.runtimeLevel.objective, state.enemies, hasMoreWaves())) {
      await handleWin();
      return;
    }

    if (state.runMode === 'main') {
      const cycleUpdate = advanceDayNightCycle(state.dayNight);
      if (cycleUpdate.changed) {
        refreshPlayerRuntimeStatsFromBag();
        state.phaseCue = cycleUpdate.message;
      } else {
        state.phaseCue = '';
      }
    } else {
      state.phaseCue = '';
    }

    state.turnCounter += 1;
    state.phase = PHASES.BeforeRoll;
    state.enemyTooltipEnemyId = null;
    const spawnResult = await spawnScheduledWaveAtDayTurnStart();
    if (spawnResult?.playerDefeated) {
      return;
    }
    if (spawnResult) {
      state.message = `Wave ${spawnResult.nextWaveIndex + 1}/${state.totalWaves} spawned at Day turn start.`;
    } else {
      state.message = 'Press Roll to start the next player turn.';
    }
    renderState();
  }

  async function executePlayerMove(path) {
    state.phase = PHASES.Moving;
    state.reachablePaths = new Map();
    state.message = 'Movement resolving.';
    renderState();

    for (const step of path.slice(1)) {
      state.player.position = clonePosition(step);
      renderState();
      await wait(180);

      const survived = await resolveLandingCell(step);
      if (!survived) {
        return;
      }
    }

    if (isObjectiveComplete(state.runtimeLevel.objective, state.enemies, hasMoreWaves())) {
      await handleWin();
      return;
    }

    await endPlayerTurn();
  }

  async function endPlayerTurn() {
    state.enemyTooltipEnemyId = null;
    await executeEnemyTurn();
  }

  const actions = {
    async startRun() {
      if (rollAnnouncementTimer) {
        window.clearTimeout(rollAnnouncementTimer);
        rollAnnouncementTimer = null;
      }
      rollAnnouncementToken += 1;
      state.runtimeLevel = state.mainRuntimeLevel;
      resetRunState(state, { runMode: 'main', runtimeLevel: state.mainRuntimeLevel });
      refreshPlayerRuntimeStatsFromBag();
      renderState();
    },
    resetProgress() {
      clearProgress();
      state.profile = loadPlayerProfile();
      state.profile.idleReward = ensureIdleRewardState();
      state.profile.runeProgress = applyRuneTrialDailyReset(state.profile.runeProgress);
      const refreshedEconomy = loadEconomy();
      economy.totalGold = refreshedEconomy.totalGold;
      economy.earnedThisRun = refreshedEconomy.earnedThisRun;
      economy.spentTotal = refreshedEconomy.spentTotal;
      state.gold = refreshedEconomy.totalGold;
      state.seenEnemyIntros = loadSeenEnemyIntros();
      refreshPlayerRuntimeStatsFromBag();
      setHomeState('Progress reset cleared player data, gold, intro flags, and playtest map.');
    },
    claimIdleReward() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      const idle = ensureIdleRewardState();
      const claimTime = new Date().toISOString();
      const claimGold = Math.max(0, Math.floor(idle.unclaimedGold || 0));
      const pendingRolls = Math.max(0, Math.floor(idle.pendingEquipmentRolls || 0));
      let grantedCount = 0;
      let equipmentSave = state.profile.equipment;
      for (let index = 0; index < pendingRolls; index += 1) {
        if (Math.random() >= IDLE_REWARD_EQUIPMENT_ROLL_CHANCE) {
          continue;
        }
        const dropResult = grantRandomTier1EquipmentDrop(equipmentSave);
        if (!dropResult.ok) {
          continue;
        }
        equipmentSave = dropResult.nextSave;
        grantedCount += 1;
      }
      state.profile.equipment = equipmentSave;
      state.profile.idleReward = {
        lastAccruedAt: claimTime,
        unclaimedGold: 0,
        pendingEquipmentRolls: 0
      };
      if (claimGold > 0) {
        state.gold += claimGold;
        state.profile.gold = state.gold;
        economy.totalGold = state.gold;
        economy.earnedThisRun = Number(economy.earnedThisRun || 0);
      }
      savePlayerProfile(state.profile);
      saveEconomy(economy);
      syncPlayerBaseFromProfile();
      state.message = `Idle claimed: +${claimGold} gold, +${grantedCount} equipment.`;
      renderState();
    },
    openGoldTechTree() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      state.homeView = 'goldTechTree';
      state.message = 'Gold Tech Tree opened.';
      renderState();
    },
    closeGoldTechTree() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      state.homeView = 'main';
      renderState();
    },
    openModes() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      state.homeView = 'modes';
      state.message = 'Modes opened.';
      renderState();
    },
    closeModes() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      state.homeView = 'main';
      state.runeTrialToast = null;
      renderState();
    },
    openRuneTrialStages() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      const progress = ensureRuneTrialProgress();
      if (getRuneTrialRemainingRewardedWins(progress) <= 0) {
        setRuneTrialToast('Today reward wins are used up. Come back after 07:00 reset.');
        return;
      }
      state.homeView = 'runeTrialStages';
      renderState();
    },
    closeRuneTrialStages() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      state.homeView = 'modes';
      state.runeTrialToast = null;
      renderState();
    },
    async startRuneTrialStage(stageId) {
      if (state.homeView !== 'runeTrialStages') {
        state.runeTrialToast = 'Open Rune Trial stage list first.';
        renderState();
        return;
      }
      const numericStage = Number(stageId || 0);
      state.runeTrialToast = `Starting Stage ${numericStage}...`;
      renderState();
      try {
        const progress = ensureRuneTrialProgress();
        if (getRuneTrialRemainingRewardedWins(progress) <= 0) {
          setRuneTrialToast('Today reward wins are used up. Come back after 07:00 reset.');
          return;
        }
        if (!isRuneTrialStageUnlocked(progress, numericStage)) {
          setRuneTrialToast('Stage is locked.');
          return;
        }
        const stageDefinition = getRuneTrialStageDefinition(numericStage);
        if (!stageDefinition) {
          setRuneTrialToast('Stage is not in the current sample build.');
          return;
        }
        const playerStats = state.mainRuntimeLevel?.playerStats || state.runtimeLevel?.playerStats || {
          hp: 180,
          dmgMin: 20,
          dmgMax: 40,
          moveMin: 1,
          moveMax: 3
        };
        const trialLevel = buildRuneTrialRuntimeLevel(stageDefinition, playerStats);
        resetRunState(state, {
          runMode: 'runeTrial',
          runtimeLevel: trialLevel,
          stageId: numericStage
        });
        refreshPlayerRuntimeStatsFromBag();
        state.screen = SCREENS.gameplay;
        state.homeView = 'main';
        state.runeTrialToast = null;
        state.message = `Rune Trial Stage ${numericStage} started.`;
        renderState();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setRuneTrialToast(`Cannot start stage: ${message}`);
      }
    },
    sweepRuneTrialStage(stageId) {
      if (state.screen !== SCREENS.home || state.homeView !== 'runeTrialStages') {
        return;
      }
      const numericStage = Number(stageId || 0);
      const progress = ensureRuneTrialProgress();
      const result = applyRuneTrialSweep(progress, numericStage);
      if (!result.ok) {
        const reasonText = result.reason === 'daily_limit'
          ? 'No rewarded wins left today.'
          : 'Sweep only works on cleared stages.';
        setRuneTrialToast(reasonText);
        return;
      }
      state.profile.runeProgress = result.nextProgress;
      savePlayerProfile(state.profile);
      state.message = `Sweep Stage ${numericStage}: +${result.reward} Rune Shard.`;
      renderState();
    },
    buyGoldTechTreeNode(nodeId) {
      if (state.screen !== SCREENS.home) {
        return;
      }
      const progress = ensureRuneTrialProgress();
      const result = buyGoldTechTreeNode({
        treeSave: state.profile.goldTechTree,
        nodeId,
        currentRuneShard: progress.runeShardBalance
      });

      if (!result.ok) {
        state.message = result.reason === 'locked'
          ? 'Node is locked.'
          : result.reason === 'maxed'
            ? 'Node is already maxed.'
            : result.reason === 'not_enough_rune_shard'
              ? 'Not enough Rune Shard.'
              : 'Cannot buy this node.';
        renderState();
        return;
      }

      state.profile.goldTechTree = result.nextSave;
      state.profile.runeProgress = {
        ...progress,
        runeShardBalance: Math.max(0, progress.runeShardBalance - result.cost)
      };
      savePlayerProfile(state.profile);

      syncPlayerBaseFromProfile();

      state.message = `Purchased node. Spent ${result.cost} Rune Shard.`;
      renderState();
    },
    openEquipment() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      state.homeView = 'equipment';
      state.equipmentBlacksmith = null;
      state.equipmentToast = null;
      state.message = 'Equipment opened.';
      renderState();
    },
    closeEquipment() {
      if (state.screen !== SCREENS.home) {
        return;
      }
      state.homeView = 'main';
      state.equipmentBlacksmith = null;
      state.equipmentToast = null;
      state.modal = null;
      renderState();
    },
    upgradeEquipmentSlot(slot) {
      if (state.screen !== SCREENS.home || state.homeView !== 'equipment') {
        return;
      }
      const result = upgradeEquipmentSlotAction({
        equipmentSave: state.profile.equipment,
        slot,
        currentGold: state.gold
      });
      if (!result.ok) {
        state.message = result.reason === 'maxed'
          ? 'Slot is already max level.'
          : result.reason === 'not_enough_gold'
            ? 'Not enough gold.'
            : 'Cannot upgrade this slot.';
        renderState();
        return;
      }

      state.profile.equipment = result.nextSave;
      state.gold = Math.max(0, state.gold - result.cost);
      state.profile.gold = state.gold;
      economy.totalGold = state.gold;
      economy.spentTotal = Number(economy.spentTotal || 0) + result.cost;
      savePlayerProfile(state.profile);
      saveEconomy(economy);

      syncPlayerBaseFromProfile();
      refreshPlayerRuntimeStatsFromBag();

      if (state.modal?.type === 'equipmentItemInfo' && state.modal.slot === slot) {
        state.modal = {
          ...state.modal
        };
      }
      state.message = `Upgraded ${slot} slot to Lv${result.nextLevel}.`;
      renderState();
    },
    closeEquipmentModal() {
      if (state.modal?.type === 'equipmentItemInfo') {
        state.modal = null;
        renderState();
      }
    },
    openEquipmentItemInfo(pieceId) {
      if (state.screen !== SCREENS.home || state.homeView !== 'equipment') {
        return;
      }
      openEquipmentItemInfoModal(pieceId);
      renderState();
    },
    equipOwnedPiece(pieceId) {
      if (state.screen !== SCREENS.home || state.homeView !== 'equipment') {
        return;
      }
      const result = equipOwnedPieceAction(state.profile.equipment, pieceId);
      if (!result.ok) {
        state.message = result.reason === 'already_equipped'
          ? 'Piece is already equipped in this slot.'
          : result.reason === 'invalid_piece_slot'
            ? 'Piece has invalid slot data.'
            : 'Cannot equip this piece.';
        renderState();
        return;
      }
      state.profile.equipment = result.nextSave;
      savePlayerProfile(state.profile);
      syncPlayerBaseFromProfile();
      refreshPlayerRuntimeStatsFromBag();
      const equippedPiece = getOwnedPieceById(state.profile.equipment, result.pieceId);
      state.message = equippedPiece
        ? `${equippedPiece.name} equipped to ${result.slot}.`
        : 'Piece equipped.';
      openEquipmentItemInfoModal(pieceId);
      renderState();
    },
    unequipOwnedPiece(pieceId) {
      if (state.screen !== SCREENS.home || state.homeView !== 'equipment') {
        return;
      }
      const result = unequipOwnedPieceAction(state.profile.equipment, pieceId);
      if (!result.ok) {
        state.message = result.reason === 'not_equipped'
          ? 'Piece is not currently equipped.'
          : result.reason === 'invalid_piece_slot'
            ? 'Piece has invalid slot data.'
            : 'Cannot unequip this piece.';
        renderState();
        return;
      }
      state.profile.equipment = result.nextSave;
      savePlayerProfile(state.profile);
      syncPlayerBaseFromProfile();
      refreshPlayerRuntimeStatsFromBag();
      const piece = getOwnedPieceById(state.profile.equipment, result.pieceId);
      state.message = piece
        ? `${piece.name} unequipped from ${result.slot}.`
        : 'Piece unequipped.';
      openEquipmentItemInfoModal(pieceId);
      renderState();
    },
    openBlacksmith() {
      if (state.screen !== SCREENS.home || state.homeView !== 'equipment') {
        return;
      }
      state.equipmentBlacksmith = {
        rootPieceId: null,
        recipeSlots: [],
        materialPieceIds: [],
        mergeCost: 0,
        mergeReady: false,
        mergeFlyPulse: false
      };
      renderState();
    },
    closeBlacksmith() {
      if (state.screen !== SCREENS.home || state.homeView !== 'equipment') {
        return;
      }
      state.equipmentBlacksmith = null;
      renderState();
    },
    selectBlacksmithRoot(pieceId) {
      if (!state.equipmentBlacksmith) {
        return;
      }
      const piece = getOwnedPieceById(state.profile.equipment, pieceId);
      if (!piece) {
        return;
      }
      state.equipmentBlacksmith.rootPieceId = piece.id;
      const slots = buildMergeRecipeSlots(piece);
      state.equipmentBlacksmith.recipeSlots = slots;
      state.equipmentBlacksmith.materialPieceIds = new Array(slots.length).fill(null);
      state.equipmentBlacksmith.mergeCost = 0;
      state.equipmentBlacksmith.mergeReady = false;
      renderState();
    },
    toggleBlacksmithMaterial(pieceId) {
      if (!state.equipmentBlacksmith?.rootPieceId) {
        showEquipmentToast('Select root equipment first.');
        return;
      }
      const piece = getOwnedPieceById(state.profile.equipment, pieceId);
      if (!piece) {
        return;
      }
      const equipped = state.profile.equipment.equippedBySlot[piece.slot] === piece.id;
      if (equipped) {
        showEquipmentToast('Equipped pieces are locked.');
        return;
      }

      const current = state.equipmentBlacksmith.materialPieceIds || [];
      const existingIndex = current.findIndex((id) => id === pieceId);
      if (existingIndex >= 0) {
        current[existingIndex] = null;
        state.equipmentBlacksmith.materialPieceIds = current;
        renderState();
        return;
      }

      const rootPiece = getOwnedPieceById(state.profile.equipment, state.equipmentBlacksmith.rootPieceId);
      const slots = state.equipmentBlacksmith.recipeSlots || [];
      const targetIndex = slots.findIndex((slotInfo, index) => {
        if (current[index]) {
          return false;
        }
        if (!rootPiece) {
          return false;
        }
        if (piece.slot !== rootPiece.slot || piece.family !== rootPiece.family || piece.tier !== rootPiece.tier) {
          return false;
        }
        if (slotInfo.matcher === 'exact_duplicate') {
          return piece.templateId === rootPiece.templateId;
        }
        return slotInfo.matcher === 'same_slot_same_family';
      });
      if (targetIndex < 0) {
        showEquipmentToast('No valid material slot for this piece.');
        return;
      }
      current[targetIndex] = pieceId;
      state.equipmentBlacksmith.materialPieceIds = current;
      renderState();
    },
    clearBlacksmithMaterial(index) {
      if (!state.equipmentBlacksmith) {
        return;
      }
      if (!Array.isArray(state.equipmentBlacksmith.materialPieceIds)) {
        return;
      }
      if (index < 0 || index >= state.equipmentBlacksmith.materialPieceIds.length) {
        return;
      }
      state.equipmentBlacksmith.materialPieceIds[index] = null;
      renderState();
    },
    mergeBlacksmith() {
      if (!state.equipmentBlacksmith?.rootPieceId) {
        showEquipmentToast('Select root equipment first.');
        return;
      }

      const result = mergeEquipmentTier({
        equipmentSave: state.profile.equipment,
        rootPieceId: state.equipmentBlacksmith.rootPieceId,
        materialPieceIds: state.equipmentBlacksmith.materialPieceIds,
        currentGold: state.gold
      });

      if (!result.ok) {
        showEquipmentToast(result.message || 'Merge requirements are not met.');
        return;
      }

      state.profile.equipment = result.nextSave;
      state.gold = Math.max(0, state.gold - result.cost);
      state.profile.gold = state.gold;
      economy.totalGold = state.gold;
      economy.spentTotal = Number(economy.spentTotal || 0) + result.cost;
      savePlayerProfile(state.profile);
      saveEconomy(economy);

      syncPlayerBaseFromProfile();
      refreshPlayerRuntimeStatsFromBag();

      state.equipmentBlacksmith.mergeFlyPulse = true;
      state.message = `Merged to Tier ${result.nextTier}.`;
      renderState();
      window.setTimeout(() => {
        if (!state.equipmentBlacksmith) {
          return;
        }
        const rootPiece = getOwnedPieceById(state.profile.equipment, result.rootPieceId);
        state.equipmentBlacksmith.mergeFlyPulse = false;
        if (rootPiece) {
          const slots = buildMergeRecipeSlots(rootPiece);
          state.equipmentBlacksmith.recipeSlots = slots;
          state.equipmentBlacksmith.materialPieceIds = new Array(slots.length).fill(null);
          state.equipmentBlacksmith.mergeCost = 0;
          state.equipmentBlacksmith.mergeReady = false;
        }
        renderState();
      }, 550);
    },
    rollMove() {
      if (state.phase !== PHASES.BeforeRoll) {
        return;
      }

      state.rolledMove = rollMoveDistance(state.player);
      state.reachablePaths = getReachableDestinations(state.runtimeLevel, state.player.position, state.rolledMove);
      state.phase = PHASES.ReachablePreview;
      state.enemyTooltipEnemyId = null;
      state.dragPath = [];
      state.dragPreviewText = 'Drag a path then release to commit.';
      state.message = `Rolled ${state.rolledMove}. Drag path length 1-${state.rolledMove}.`;
      scheduleRollAnnouncement(state.rolledMove);
      renderState();
    },
    async skipTurn() {
      if (state.phase !== PHASES.BeforeRoll) {
        return;
      }
      state.rolledMove = null;
      state.reachablePaths = new Map();
      state.dragPath = [];
      state.dragPreviewText = '';
      state.isDraggingPath = false;
      state.message = 'Turn skipped.';
      renderState();
      await wait(120);
      await endPlayerTurn();
    },
    toggleEnemyThreatPreview() {
      if (state.screen !== SCREENS.gameplay) {
        return;
      }
      state.enemyThreatPreviewEnabled = !state.enemyThreatPreviewEnabled;
      renderState();
    },
    toggleEnemyTooltip(enemyId) {
      if (state.phase !== PHASES.BeforeRoll) {
        return;
      }
      if (!enemyId) {
        return;
      }
      state.enemyTooltipEnemyId = state.enemyTooltipEnemyId === enemyId ? null : enemyId;
      renderState();
    },
    beginDragPath(coordKey) {
      if (state.phase !== PHASES.ReachablePreview) {
        return;
      }

      const startPosition = fromCoordKey(coordKey);
      if (!sameCoord(startPosition, state.player.position)) {
        return;
      }
      state.isDraggingPath = true;
      state.dragPath = [];
      state.dragPreviewText = 'Drag from current tile to preview path.';
      renderState();
    },
    extendDragPath(coordKey) {
      if (state.phase !== PHASES.ReachablePreview || !state.isDraggingPath) {
        return;
      }

      const nextPosition = fromCoordKey(coordKey);
      if (
        canExtendDraggedPath({
          level: state.runtimeLevel,
          playerPosition: state.player.position,
          currentPath: state.dragPath,
          nextPosition,
          maxDistance: state.rolledMove
        })
      ) {
        state.dragPath.push(nextPosition);
        state.dragPreviewText = getPathPreviewText(state.dragPath);
        renderState();
      }
    },
    async commitDragPath() {
      if (!state.isDraggingPath) {
        return;
      }

      state.isDraggingPath = false;
      if (state.dragPath.length < 1) {
        state.dragPreviewText = 'Drag a path then release to commit.';
        renderState();
        return;
      }

      const committedPath = [clonePosition(state.player.position), ...state.dragPath.map((step) => ({ ...step }))];
      state.dragPath = [];
      state.dragPreviewText = '';
      await executePlayerMove(committedPath);
    },
    selectBagOffer(itemId) {
      state.modal?.onSelectOffer?.(itemId);
    },
    skipBagOffer() {
      state.modal?.onSkipOffer?.();
    },
    rerollBagOffer() {
      state.modal?.onRerollOffer?.();
    },
    swapBagSlot(slotIndex) {
      state.modal?.onSwap?.(slotIndex);
    },
    cancelBagSwap() {
      state.modal?.onCancel?.();
    },
    fuseBagItem(fusionId) {
      state.modal?.onFuse?.(fusionId);
    },
    skipBagFusion() {
      state.modal?.onSkip?.();
    },
    closeModal() {
      state.modal?.onClose?.();
    }
  };

  return {
    state,
    actions,
    renderState
  };
}
