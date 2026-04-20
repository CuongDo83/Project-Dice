import { getEnemyVisiblePower, getPlayerVisiblePower } from '../state/game-state.js';
import { BASELINE_PLAYER_CONFIG } from '../data/player-config.js';
import { DAY_NIGHT_ROUND_LENGTH } from '../data/day-night-config.js';
import { TILE_CONFIG } from '../data/tile-config.js';
import { PHASES, SCREENS } from '../shared/constants.js';
import { sameCoord, toCoordKey } from '../shared/coords.js';

const ITEM_ICON_EMOJI_BY_TOKEN = {
  '[PT]': '🧭',
  '[SA]': '🪨',
  '[FK]': '🧰',
  '[SC]': '☀️',
  '[MW]': '🌙',
  '[GC]': '🛡️',
  '[SE]': '⚖️',
  '[PE]': '⚔️',
  '[KE]': '🎯',
  '[FF]': '🦷',
  '[IG]': '🧱',
  '[BC]': '🩸',
  '[TS]': '🌀',
  '[SF]': '☀️',
  '[MF]': '🌙'
};

const ITEM_ICON_EMOJI_BY_ID = {
  pathfinder_token: '🧭',
  step_anchor: '🪨',
  field_kit: '🧰',
  sun_compass: '☀️',
  moon_ward: '🌙',
  guard_crest: '🛡️',
  stable_edge: '⚖️',
  power_edge: '⚔️',
  keen_eye: '🎯',
  fatal_fang: '🦷',
  iron_guard: '🧱',
  blood_charm: '🩸',
  twin_sigil: '🌀',
  sun_fang: '☀️',
  moon_fang: '🌙',
  route_master: '🧭',
  field_marshal: '🧰',
  scavenger_sprint: '🧭',
  sunrunner: '☀️',
  night_shelter: '🌙',
  bulwark_line: '🛡️',
  siege_heart: '⚔️',
  hunter_guard: '🎯',
  last_stand: '⚔️',
  iron_rhythm: '🧱',
  sustain_rhythm: '🩸',
  critical_burst: '⚔️',
  twin_reaper: '🌀',
  death_mark: '🎯',
  sunbreaker: '☀️'
};

const ITEM_ICON_EMOJI_BY_NAME = {
  'Route Master': '🧭',
  'Field Marshal': '🧰',
  'Scavenger Sprint': '🧭',
  Sunrunner: '☀️',
  'Night Shelter': '🌙',
  'Bulwark Line': '🛡️',
  'Siege Heart': '⚔️',
  'Hunter Guard': '🎯',
  'Last Stand': '⚔️',
  'Iron Rhythm': '🧱',
  'Sustain Rhythm': '🩸',
  'Critical Burst': '⚔️',
  'Twin Reaper': '🌀',
  'Death Mark': '🎯',
  Sunbreaker: '☀️'
};

const STAT_ICON_BY_KEY = {
  maxHp: '❤️',
  dmgMin: '⚔️',
  dmgMax: '⚔️',
  minRoll: '🎲',
  maxRoll: '🎲',
  healEfficiency: '🧪',
  critChance: '🎯',
  critDamage: '💥',
  blockChance: '🛡️',
  lifesteal: '🩸',
  doubleStrike: '🌀',
  dayDmgMin: '☀️',
  dayDmgMax: '☀️',
  dayMaxRoll: '☀️',
  dayCritChance: '☀️',
  nightDamageTakenReduction: '🌙',
  nightDmgMin: '🌙',
  nightDmgMax: '🌙'
};

function getBagItemEmoji(info = {}) {
  if (info.icon && ITEM_ICON_EMOJI_BY_TOKEN[info.icon]) {
    return ITEM_ICON_EMOJI_BY_TOKEN[info.icon];
  }
  if (info.family?.includes('Guard') || info.family?.includes('Fortify')) {
    return '🛡️';
  }
  if (info.family?.includes('Day')) {
    return '☀️';
  }
  if (info.family?.includes('Night')) {
    return '🌙';
  }
  return '⚔️';
}

function getItemEmojiById(itemId) {
  return ITEM_ICON_EMOJI_BY_ID[itemId] || '🎒';
}

function formatRecipeText(recipeRelation) {
  const recipes = String(recipeRelation || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (recipes.length === 0) {
    return 'No direct fusion recipe';
  }
  return recipes.map((name) => `${ITEM_ICON_EMOJI_BY_NAME[name] || '✨'} ${name}`).join(', ');
}

function getStatIcon(statKey) {
  return STAT_ICON_BY_KEY[statKey] || '📌';
}

function createActionButton(label, handler, disabled = false) {
  const button = document.createElement('button');
  button.className = 'primary-button';
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener('click', handler);
  return button;
}

function createHudChip(text, extraClass = '') {
  const chip = document.createElement('div');
  chip.className = `wire-chip ${extraClass}`.trim();
  chip.textContent = text;
  return chip;
}

function createPhaseChip(dayNight) {
  const phase = dayNight?.phase === 'Night' ? 'Night' : 'Day';
  const totalBars = DAY_NIGHT_ROUND_LENGTH[phase] || (phase === 'Night' ? 2 : 4);
  const remainingBars = Math.max(0, Math.min(totalBars, Number(dayNight?.remainingRoundsInPhase ?? totalBars)));
  const chip = document.createElement('div');
  chip.className = `wire-chip phase-chip ${phase === 'Night' ? 'is-night' : 'is-day'}`;

  const label = document.createElement('span');
  label.textContent = phase === 'Night' ? '🌙 Night' : '☀️ Day';
  chip.append(label);

  const bars = document.createElement('div');
  bars.className = 'phase-turn-bars';
  for (let index = 0; index < totalBars; index += 1) {
    const bar = document.createElement('span');
    bar.className = `phase-turn-bar ${index < remainingBars ? 'is-on' : 'is-off'}`;
    bars.append(bar);
  }
  chip.append(bars);

  return chip;
}

function createPhaseBadge(state) {
  const badge = document.createElement('div');
  const isNight = state.dayNight?.phase === 'Night';
  badge.className = `phase-badge ${isNight ? 'is-night' : 'is-day'}`;
  badge.textContent = isNight ? '🌙 Night · Enemy speed x2 / atk x2' : '☀️ Day · Safer attack window';
  return badge;
}

function createScreenFrame(title, subtitle) {
  const shell = document.createElement('section');
  shell.className = 'ui-shell';

  const frame = document.createElement('div');
  frame.className = 'ui-frame';

  const header = document.createElement('header');
  header.className = 'ui-frame-header';
  header.innerHTML = `
    <div>
      <div class="ui-kicker">DiceBound v3 UI</div>
      <h2 class="ui-title">${title}</h2>
      ${subtitle ? `<p class="ui-subtitle">${subtitle}</p>` : ''}
    </div>
    <div class="ui-pill">Portrait · Mobile-first</div>
  `;

  const body = document.createElement('div');
  body.className = 'ui-frame-body';

  frame.append(header, body);
  shell.append(frame);
  return { shell, frame, body };
}

function renderHomeScreen(state, actions) {
  const { shell, body } = createScreenFrame('🏠 Home', 'Meta progression + start run');
  const wrapper = document.createElement('div');
  wrapper.className = 'home-layout';
  wrapper.innerHTML = `
    <div class="panel panel-strong">
      <div class="panel-row">
        <div>
          <div class="panel-kicker">Prototype hub</div>
          <div class="panel-title">DiceBound</div>
        </div>
        <div class="gold-box">
          <div>🪙 Gold</div>
          <strong>${state.gold || 0}</strong>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-chip"><small>❤️ Base HP</small><strong>${state.player.hp.max}</strong></div>
        <div class="stat-chip"><small>⚔️ Min DMG</small><strong>${state.player.dmg.min}</strong></div>
        <div class="stat-chip"><small>⚔️ Max DMG</small><strong>${state.player.dmg.max}</strong></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-row">
        <div>
          <div class="panel-subtitle">⏳ Idle Reward</div>
          <div class="panel-note">Supplemental catch-up income from online + offline time.</div>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-chip"><small>🪙 Unclaimed Gold</small><strong>${Number(state.idleRewardView?.unclaimedGold || 0)}</strong></div>
        <div class="stat-chip"><small>🎁 Pending Rolls</small><strong>${Number(state.idleRewardView?.pendingEquipmentRolls || 0)}</strong></div>
      </div>
      <div class="button-row idle-reward-actions"></div>
    </div>
    <div class="panel">
      <div class="panel-row">
        <div>
          <div class="panel-subtitle">⬆️ Permanent upgrades</div>
          <div class="panel-note">Home upgrades: hp, dmgMin, dmgMax</div>
        </div>
      </div>
      <div class="upgrade-row"><span>❤️ Max HP</span><button disabled>⬆️ Upgrade</button></div>
      <div class="upgrade-row"><span>⚔️ Min DMG</span><button disabled>⬆️ Upgrade</button></div>
      <div class="upgrade-row"><span>⚔️ Max DMG</span><button disabled>⬆️ Upgrade</button></div>
    </div>
  `;

  const actionRow = document.createElement('div');
  actionRow.className = 'home-actions';
  actionRow.append(
    createActionButton('🎲 Start Run', actions.startRun),
    createActionButton('🧭 Modes', actions.openModes),
    createActionButton('🌳 Gold Tech Tree', actions.openGoldTechTree),
    createActionButton('⚒️ Equipment', actions.openEquipment),
    createActionButton('🔄 Reset Progress', actions.resetProgress)
  );

  const idleActions = wrapper.querySelector('.idle-reward-actions');
  if (idleActions) {
    idleActions.append(createActionButton('⏳ Claim Idle Reward', actions.claimIdleReward));
  }

  body.append(wrapper, actionRow);
  return shell;
}

function renderModesScreen(state, actions) {
  const { shell, body } = createScreenFrame('🧭 Modes', 'Choose your daily side-mode');
  const wrap = document.createElement('div');
  wrap.className = 'modes-layout';
  const modeCard = document.createElement('div');
  modeCard.className = 'panel panel-strong';
  modeCard.innerHTML = `
    <div class="panel-row">
      <div>
        <div class="panel-kicker">Daily Mode</div>
        <div class="panel-title">Rune Trial</div>
      </div>
      <div class="gold-box">
        <div>🧩 Rune Shard</div>
        <strong>${Number(state.runeTrialView?.runeShardBalance || 0)}</strong>
      </div>
    </div>
    <div class="panel-note">Rewarded wins left: ${Number(state.runeTrialView?.remainingRewardedWins || 0)} / 2</div>
    <div class="panel-note">Highest cleared stage: ${Number(state.runeTrialView?.highestClearedStage || 0)}</div>
  `;
  const row = document.createElement('div');
  row.className = 'button-row';
  row.append(createActionButton('Enter Rune Trial', actions.openRuneTrialStages));
  modeCard.append(row);
  if (state.runeTrialToast) {
    const toast = document.createElement('div');
    toast.className = 'rune-trial-toast';
    toast.textContent = state.runeTrialToast;
    modeCard.append(toast);
  }

  const back = document.createElement('div');
  back.className = 'home-actions';
  back.append(createActionButton('⬅️ Back Home', actions.closeModes));
  wrap.append(modeCard, back);
  body.append(wrap);
  return shell;
}

function renderRuneTrialStageSelectScreen(state, actions) {
  const { shell, body } = createScreenFrame('🧩 Rune Trial', 'Stage select');
  const wrap = document.createElement('div');
  wrap.className = 'rune-trial-stage-layout';
  const header = document.createElement('div');
  header.className = 'panel panel-strong';
  header.innerHTML = `
    <div class="panel-row">
      <div>
        <div class="panel-kicker">Daily Progress</div>
        <div class="panel-title">Rune Trial Stages</div>
      </div>
      <div class="gold-box">
        <div>🧩 Rune Shard</div>
        <strong>${Number(state.runeTrialView?.runeShardBalance || 0)}</strong>
      </div>
    </div>
    <div class="panel-note">Rewarded wins left: ${Number(state.runeTrialView?.remainingRewardedWins || 0)} / 2</div>
  `;
  const list = document.createElement('div');
  list.className = 'rune-trial-stage-list';
  const hasRewardedWins = Number(state.runeTrialView?.remainingRewardedWins || 0) > 0;
  (state.runeTrialView?.stages || []).forEach((entry) => {
    const stageCard = document.createElement('div');
    stageCard.className = 'rune-trial-stage-card';
    stageCard.innerHTML = `
      <div class="rune-trial-stage-top">
        <strong>Stage ${entry.stageId}</strong>
        <span>${entry.cleared ? 'Cleared' : 'Not cleared'}</span>
      </div>
      <div class="rune-trial-stage-reward">Reward: ${entry.reward} Rune Shard</div>
    `;
    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    buttonRow.append(
      createActionButton('Play', () => actions.startRuneTrialStage(entry.stageId), !entry.unlocked || !hasRewardedWins),
      createActionButton('Sweep', () => actions.sweepRuneTrialStage(entry.stageId), !entry.canSweep)
    );
    stageCard.append(buttonRow);
    list.append(stageCard);
  });
  if (state.runeTrialToast) {
    const toast = document.createElement('div');
    toast.className = 'rune-trial-toast';
    toast.textContent = state.runeTrialToast;
    wrap.append(toast);
  }
  const row = document.createElement('div');
  row.className = 'home-actions';
  row.append(createActionButton('⬅️ Back Modes', actions.closeRuneTrialStages));
  wrap.append(header, list, row);
  body.append(wrap);
  return shell;
}

function renderEquipmentScreen(state, actions) {
  const { shell, body } = createScreenFrame('⚒️ Equipment', 'Slot upgrade + piece merge tier');
  const wrap = document.createElement('div');
  wrap.className = 'equipment-layout';

  const topBar = document.createElement('div');
  topBar.className = 'equipment-top-bar';
  topBar.append(
    createActionButton('⬅️ Back', actions.closeEquipment),
    (() => {
      const gold = document.createElement('div');
      gold.className = 'gold-box';
      gold.innerHTML = `<div>🪙 Gold</div><strong>${state.gold || 0}</strong>`;
      return gold;
    })()
  );

  const header = document.createElement('div');
  header.className = 'panel panel-strong';
  header.innerHTML = `
    <div class="panel-kicker">Home progression</div>
    <div class="panel-title">Equipment</div>
    <div class="panel-note">Upgrade is slot-based. Merge tier stays on each piece.</div>
  `;

  const slotById = new Map((state.equipmentView?.slots || []).map((slot) => [slot.slot, slot]));
  const equippedArea = document.createElement('div');
  equippedArea.className = 'equipment-equipped-area';
  const leftColumn = document.createElement('div');
  leftColumn.className = 'equipment-equipped-column';
  const rightColumn = document.createElement('div');
  rightColumn.className = 'equipment-equipped-column';
  const center = document.createElement('div');
  center.className = 'equipment-character-center';
  center.innerHTML = `
    <img src="${BASELINE_PLAYER_CONFIG.asset}" alt="Player" draggable="false" />
    <span>Character</span>
  `;

  function createEquippedSlotIcon(slot) {
    const icon = document.createElement('button');
    icon.className = `equipment-slot-icon ${slot.pieceId ? 'is-filled' : 'is-empty'}`;
    icon.innerHTML = `
      <span class="equipment-slot-icon-slot">${slot.slotIcon}</span>
      <span class="equipment-slot-icon-tier">${slot.pieceTier ? `T${slot.pieceTier}` : '-'}</span>
      <span class="equipment-slot-icon-level">Lv${slot.level}</span>
    `;
    if (slot.pieceId) {
      icon.addEventListener('click', () => actions.openEquipmentItemInfo(slot.pieceId));
    }
    return icon;
  }

  const leftSlots = ['weapon', 'helmet'].map((id) => slotById.get(id)).filter(Boolean);
  const rightSlots = ['auxiliary', 'armor'].map((id) => slotById.get(id)).filter(Boolean);
  leftSlots.forEach((slot) => leftColumn.append(createEquippedSlotIcon(slot)));
  rightSlots.forEach((slot) => rightColumn.append(createEquippedSlotIcon(slot)));
  equippedArea.append(leftColumn, center, rightColumn);

  const ownedList = document.createElement('div');
  ownedList.className = 'equipment-owned-list';
  (state.equipmentView?.ownedPieces || []).filter((piece) => !piece.equipped).forEach((piece) => {
    const tile = document.createElement('button');
    tile.className = 'equipment-owned-item';
    tile.innerHTML = `
      <div class="equipment-owned-icon">${piece.slotIcon}</div>
      <div class="equipment-owned-name">${piece.name}</div>
      <div class="equipment-owned-tier">T${piece.tier}</div>
      <div class="equipment-owned-family">${piece.familyIcon}</div>
    `;
    tile.title = `${piece.slotLabel} · ${piece.familyLabel}`;
    tile.addEventListener('click', () => actions.openEquipmentItemInfo(piece.id));
    ownedList.append(tile);
  });

  const ownedTitle = document.createElement('div');
  ownedTitle.className = 'panel-note';
  ownedTitle.textContent = 'Owned Equipment';

  const bottom = document.createElement('div');
  bottom.className = 'equipment-actions';
  bottom.append(
    createActionButton('⚒️ Blacksmith', actions.openBlacksmith)
  );

  if (state.equipmentToast) {
    const toast = document.createElement('div');
    toast.className = 'equipment-toast';
    toast.textContent = state.equipmentToast;
    wrap.append(toast);
  }

  wrap.append(topBar, header, equippedArea, ownedTitle, ownedList, bottom);
  body.append(wrap);
  return shell;
}

function formatSlotBonusLines(slotBonus = {}) {
  const rows = [];
  const hp = Number(slotBonus.maxHp || 0);
  const min = Number(slotBonus.dmgMin || 0);
  const max = Number(slotBonus.dmgMax || 0);
  if (hp !== 0) {
    rows.push(`+${hp} Max HP`);
  }
  if (min !== 0 || max !== 0) {
    rows.push(`+${min} Min DMG · +${max} Max DMG`);
  }
  if (rows.length === 0) {
    rows.push('No slot stat bonus.');
  }
  return rows;
}

function renderEquipmentItemInfoModal(state, actions) {
  const modal = document.createElement('div');
  modal.className = 'overlay';
  const card = document.createElement('div');
  card.className = 'overlay-card equipment-item-info-modal';
  const pieceId = state.modal?.pieceId;
  const piece = (state.equipmentView?.ownedPieces || []).find((entry) => entry.id === pieceId);
  if (!piece) {
    return modal;
  }
  const slot = (state.equipmentView?.slots || []).find((entry) => entry.slot === piece.slot);
  const slotOccupiedByOtherPiece = Boolean(slot?.pieceId && slot.pieceId !== piece.id);
  const actionLabel = slotOccupiedByOtherPiece ? 'Swap' : 'Equip';

  card.innerHTML = `
    <button class="equipment-close-button" type="button" aria-label="Close">✕</button>
    <h3>${piece.slotIcon} ${piece.name}</h3>
    <div class="equipment-item-subline">${piece.familyIcon} ${piece.familyLabel} · ${piece.slotLabel} · Tier ${piece.tier}</div>
    <div class="equipment-slot-stats-block">
      <div class="equipment-slot-stats-title">Current Slot Stats (Lv${Number(slot?.level || 1)})</div>
      <div class="equipment-slot-stats-lines">
        ${formatSlotBonusLines(slot?.currentBonus).map((line) => `<span>${line}</span>`).join('')}
      </div>
      <div class="equipment-slot-stats-note">${slot?.pieceId ? 'Active while a piece is equipped in this slot.' : 'Inactive: this slot is currently unequipped.'}</div>
    </div>
    <div class="equipment-item-tier-lines">
      ${(piece.tierLines || []).map((line) => `
        <div class="equipment-item-tier-line ${line.unlocked ? 'is-unlocked' : 'is-locked'}">
          <div class="equipment-item-tier-head">${line.label}</div>
          <div class="equipment-item-tier-effects">
            ${(line.effects || []).length > 0 ? (line.effects || []).map((effect) => `<span>${effect}</span>`).join('') : '<span>No additional effect</span>'}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';
  if (piece.equipped) {
    const upgradeCost = Number(slot?.nextCost || 0);
    const canUpgrade = Boolean(slot?.canUpgrade);
    const canAfford = Boolean(slot?.canAffordUpgrade);
    const cost = document.createElement('div');
    cost.className = `equipment-upgrade-cost-inline ${canAfford ? '' : 'is-unaffordable'}`.trim();
    cost.textContent = canUpgrade ? `Upgrade cost: ${upgradeCost} gold` : 'Slot max level';
    card.append(cost);
    buttonRow.append(
      createActionButton('Unequip', () => actions.unequipOwnedPiece(piece.id)),
      createActionButton(
        canUpgrade ? 'Upgrade' : 'Max Level',
        () => actions.upgradeEquipmentSlot(piece.slot),
        !canUpgrade || !canAfford
      )
    );
  } else {
    buttonRow.append(
      createActionButton(actionLabel, () => actions.equipOwnedPiece(piece.id))
    );
  }
  card.append(buttonRow);

  card.querySelector('.equipment-close-button')?.addEventListener('click', () => actions.closeEquipmentModal());
  modal.append(card);
  return modal;
}

function renderBlacksmithModal(state, actions) {
  const modal = document.createElement('div');
  modal.className = 'overlay';
  const card = document.createElement('div');
  card.className = 'overlay-card blacksmith-modal';
  const blacksmith = state.equipmentBlacksmith;
  if (!blacksmith) {
    return modal;
  }

  const rootPiece = blacksmith.rootPieceId
    ? (state.equipmentView?.ownedPieces || []).find((piece) => piece.id === blacksmith.rootPieceId)
    : null;

  card.innerHTML = `
    <button class="equipment-close-button" type="button" aria-label="Close">✕</button>
    <h3>⚒️ Blacksmith</h3>
    <div class="blacksmith-root-slot ${blacksmith.mergeFlyPulse ? 'is-merge-pulse' : ''}">
      ${rootPiece
        ? `
          <div class="blacksmith-root-icon">${rootPiece.slotIcon}</div>
          <div class="blacksmith-root-meta">
            <span>${rootPiece.name}</span>
            <span>${rootPiece.familyIcon} ${rootPiece.familyLabel} · T${rootPiece.tier}</span>
          </div>
        `
        : '<div class="blacksmith-root-empty">Select root equipment from owned list</div>'}
    </div>
  `;

  const recipeArea = document.createElement('div');
  recipeArea.className = 'blacksmith-recipe';
  (blacksmith.recipeSlots || []).forEach((slotInfo, index) => {
    const pieceId = blacksmith.materialPieceIds?.[index];
    const material = pieceId
      ? (state.equipmentView?.ownedPieces || []).find((piece) => piece.id === pieceId)
      : null;
    const slotButton = document.createElement('button');
    slotButton.className = `blacksmith-material-slot ${material ? 'is-filled' : ''}`;
    const requirementText = slotInfo.matcher === 'exact_duplicate'
      ? 'Need exact duplicate'
      : 'Need same-slot same-family';
    slotButton.title = material
      ? `${material.slotLabel} · ${material.name} · T${material.tier}`
      : requirementText;
    slotButton.innerHTML = material ? `${material.slotIcon}` : '+';
    slotButton.addEventListener('click', () => {
      if (!material) {
        return;
      }
      actions.clearBlacksmithMaterial(index);
    });
    recipeArea.append(slotButton);
  });
  card.append(recipeArea);

  const mergeRow = document.createElement('div');
  mergeRow.className = 'button-row';
  mergeRow.append(
    createActionButton(
      `Merge (${blacksmith.mergeCost || 0} gold)`,
      actions.mergeBlacksmith
    )
  );
  card.append(mergeRow);

  const owned = document.createElement('div');
  owned.className = 'blacksmith-owned-list';
  (state.equipmentView?.ownedPieces || []).forEach((piece) => {
    const item = document.createElement('button');
    const isRoot = blacksmith.rootPieceId === piece.id;
    item.className = `blacksmith-owned-item ${piece.equipped ? 'is-locked' : ''} ${isRoot ? 'is-root' : ''}`;
    item.title = `${piece.slotLabel} · ${piece.familyLabel}`;
    item.innerHTML = `
      <div class="equipment-owned-icon">${piece.slotIcon}</div>
      <div class="equipment-owned-name">${piece.name}</div>
      <div class="equipment-owned-tier">T${piece.tier}</div>
      <div class="equipment-owned-family">${piece.familyIcon}</div>
      ${piece.equipped ? '<span class="equipment-equipped-tag">E</span>' : ''}
      ${piece.equipped ? '<span class="equipment-lock-overlay">🔒</span>' : ''}
    `;
    item.addEventListener('click', () => {
      if (!blacksmith.rootPieceId) {
        actions.selectBlacksmithRoot(piece.id);
        return;
      }
      if (isRoot) {
        return;
      }
      actions.toggleBlacksmithMaterial(piece.id);
    });
    owned.append(item);
  });
  card.append(owned);

  if (blacksmith.mergeFlyPulse && rootPiece) {
    const fly = document.createElement('div');
    fly.className = 'blacksmith-merge-fly';
    fly.textContent = `${rootPiece.slotIcon} ${rootPiece.name} T${rootPiece.tier}`;
    card.append(fly);
  }

  card.querySelector('.equipment-close-button')?.addEventListener('click', () => actions.closeBlacksmith());
  modal.append(card);
  return modal;
}

function findNodeViewById(treeView, nodeId) {
  return (treeView?.nodes || []).find((node) => node.id === nodeId) || null;
}

function renderGoldTechTreeScreen(state, actions) {
  const { shell, body } = createScreenFrame('🌳 Gold Tech Tree', 'Out-of-run permanent baseline progression');
  const wrap = document.createElement('div');
  wrap.className = 'gold-tech-tree-layout';

  const header = document.createElement('div');
  header.className = 'panel panel-strong';
  header.innerHTML = `
    <div class="panel-row">
      <div>
        <div class="panel-kicker">Home progression</div>
        <div class="panel-title">Gold Tech Tree v1</div>
      </div>
      <div class="gold-box">
        <div>🧩 Rune Shard</div>
        <strong>${Number(state.runeTrialView?.runeShardBalance || 0)}</strong>
      </div>
    </div>
    <div class="panel-note">Tap node to buy immediately. Locked status is derived from prerequisites at runtime.</div>
  `;

  const tree = document.createElement('div');
  tree.className = 'gold-tech-tree';
  (state.goldTechTreeView?.rows || []).forEach((rowIds) => {
    const row = document.createElement('div');
    row.className = 'gold-tech-tree-row';
    rowIds.forEach((nodeId) => {
      const node = findNodeViewById(state.goldTechTreeView, nodeId);
      if (!node) {
        return;
      }

      const nodeButton = document.createElement('button');
      const statusClass = String(node.status || 'Locked').toLowerCase().replace(/\s+/g, '-');
      nodeButton.className = `gold-tech-node is-${statusClass}`;
      nodeButton.disabled = !node.canBuy;
      nodeButton.innerHTML = `
        <div class="gold-tech-node-head">
          <span class="gold-tech-icon">${node.icon}</span>
          <span class="gold-tech-name">${node.name}</span>
        </div>
        <span class="gold-tech-level">Lv ${node.level}/${node.maxLevel || 0}</span>
        <span class="gold-tech-cost">Cost: ${node.nextCost} Rune Shard</span>
        <span class="gold-tech-effect">${node.mainEffectText}</span>
        <span class="gold-tech-status">${node.status}</span>
      `;

      if (node.maxLevel > 0) {
        nodeButton.addEventListener('click', () => actions.buyGoldTechTreeNode(node.id));
      }
      row.append(nodeButton);
    });
    tree.append(row);
  });

  const actionsRow = document.createElement('div');
  actionsRow.className = 'home-actions gold-tech-tree-actions';
  actionsRow.append(createActionButton('⬅️ Back Home', actions.closeGoldTechTree));

  wrap.append(header, tree, actionsRow);
  body.append(wrap);
  return shell;
}

function buildCellContent(state, position) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cell-content';
  const coordKey = toCoordKey(position);
  const isEnemyWarningTile = Boolean(
    state.waveWarning?.active &&
    state.waveWarning.spawnPositions?.some((spawn) => sameCoord(spawn, position))
  );
  const isMysteryWarningTile = Boolean(
    state.waveWarning?.active &&
    state.waveWarning.mysterySpawnPositions?.some((spawn) => sameCoord(spawn, position))
  );

  if (state.enemyThreatPreview?.darkKeys?.has(coordKey)) {
    const overlay = document.createElement('span');
    overlay.className = 'threat-overlay is-light';
    wrapper.append(overlay);
  } else if (state.enemyThreatPreview?.lightKeys?.has(coordKey)) {
    const overlay = document.createElement('span');
    overlay.className = 'threat-overlay is-dark';
    wrapper.append(overlay);
  }

  if (sameCoord(position, state.player.position)) {
    const token = document.createElement('img');
    token.className = 'cell-asset player-token';
    token.src = BASELINE_PLAYER_CONFIG.asset;
    token.alt = 'Player';
    token.draggable = false;
    wrapper.append(token);
  }

  const enemy = state.enemies.find((entry) => entry.alive && sameCoord(entry.currentPosition, position));
  if (enemy) {
    const token = document.createElement('img');
    token.className = 'cell-asset enemy-token';
    token.src = enemy.asset;
    token.alt = enemy.label;
    token.draggable = false;
    const power = document.createElement('span');
    power.className = 'cell-power-badge';
    power.textContent = String(getEnemyVisiblePower(enemy));
    wrapper.append(token);
    wrapper.append(power);

    if (state.enemyRollPreview?.enemyId === enemy.id) {
      const rollPreview = document.createElement('span');
      rollPreview.className = 'enemy-roll-preview';
      rollPreview.textContent = String(state.enemyRollPreview.value);
      wrapper.append(rollPreview);
    }

    if (state.phase === PHASES.BeforeRoll && state.enemyTooltipEnemyId === enemy.id) {
      const tooltip = document.createElement('div');
      tooltip.className = 'enemy-small-tooltip';
      tooltip.innerHTML = `
        <strong>${enemy.label}</strong>
        <span>Lv ${enemy.level}</span>
        <span>HP ${enemy.currentHp}/${enemy.hp}</span>
        <span>DMG ${enemy.dmgMin}-${enemy.dmgMax}</span>
        <span>SPD ${enemy.moveSpeedMin}-${enemy.moveSpeedMax}</span>
      `;
      wrapper.append(tooltip);
    }
  }

  const mysteryCell = state.runtimeLevel.mysteryCells.find((cell) => !cell.consumed && sameCoord({ x: cell.x, y: cell.y }, position));
  if (mysteryCell) {
    if (TILE_CONFIG.mysteryAsset) {
      const token = document.createElement('img');
      token.className = 'cell-asset mystery-token';
      token.src = TILE_CONFIG.mysteryAsset;
      token.alt = 'Mystery';
      token.draggable = false;
      wrapper.append(token);
    }
    const marker = document.createElement('span');
    marker.className = 'board-emoji-token mystery';
    marker.textContent = '❓';
    wrapper.append(marker);
  }

  const potion = state.healPotions?.find((entry) => sameCoord({ x: entry.x, y: entry.y }, position));
  if (potion) {
    const marker = document.createElement('span');
    marker.className = 'heal-potion-token';
    marker.textContent = '❤️';
    wrapper.append(marker);
  }

  if (isEnemyWarningTile) {
    const marker = document.createElement('span');
    marker.className = 'wave-warning-marker is-enemy-warning';
    marker.textContent = '❌';
    marker.setAttribute('aria-label', 'Next wave enemy warning');
    wrapper.append(marker);
  }

  if (isMysteryWarningTile) {
    const marker = document.createElement('span');
    marker.className = 'wave-warning-marker is-mystery-warning';
    marker.textContent = '❌';
    marker.setAttribute('aria-label', 'Next wave mystery warning');
    wrapper.append(marker);
  }

  const rewardDrops = (state.rewardFlyDrops || []).filter((drop) => sameCoord(drop.origin, position));
  rewardDrops.forEach((drop) => {
    const token = document.createElement('span');
    token.className = `enemy-drop-feedback ${drop.type === 'equipment' ? 'is-equipment' : 'is-gold'} ${drop.phase === 'fly' ? 'is-fly' : 'is-jump'}`;
    token.textContent = drop.type === 'equipment' ? '🎁' : '🪙';
    wrapper.append(token);
  });

  return wrapper;
}

function renderBoard(state, actions) {
  const board = document.createElement('div');
  board.className = 'board';
  if (state.runMode === 'main' && state.dayNight?.phase === 'Night') {
    board.classList.add('is-night-phase');
  }
  board.style.setProperty('--grid-columns', String(state.runtimeLevel.gridWidth));

  for (let y = 0; y < state.runtimeLevel.gridHeight; y += 1) {
    for (let x = 0; x < state.runtimeLevel.gridWidth; x += 1) {
      const position = { x, y };
      const key = toCoordKey(position);
      const isWalkable = state.runtimeLevel.walkableKeys.has(key);
      const cell = document.createElement('button');
      cell.className = `board-cell ${isWalkable ? 'is-walkable' : 'is-blocked'}`;
      cell.dataset.coordKey = key;
      cell.disabled = true;
      cell.style.backgroundImage = `url("${isWalkable ? TILE_CONFIG.walkableAsset : TILE_CONFIG.blockedAsset}")`;

      if (state.reachablePaths.has(key)) {
        cell.classList.add('is-reachable');
      }

      if (state.enemyThreatPreview?.darkKeys?.has(key)) {
        cell.classList.add('is-threat-dark');
      } else if (state.enemyThreatPreview?.lightKeys?.has(key)) {
        cell.classList.add('is-threat-light');
      }

      if (state.phase === PHASES.ReachablePreview && isWalkable) {
        cell.disabled = false;
        cell.addEventListener('pointerenter', () => actions.extendDragPath(key));
        cell.addEventListener('pointerup', () => actions.commitDragPath());
        if (sameCoord(position, state.player.position)) {
          cell.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            actions.beginDragPath(key);
          });
          cell.classList.add('is-drag-origin');
        }
      }

      const enemyAtCell = state.enemies.find((entry) => entry.alive && sameCoord(entry.currentPosition, position));
      if (state.phase === PHASES.BeforeRoll && enemyAtCell) {
        cell.disabled = false;
        cell.addEventListener('click', () => actions.toggleEnemyTooltip(enemyAtCell.id));
      }

      const dragIndex = state.dragPath.findIndex((step) => sameCoord(step, position));
      if (dragIndex >= 0) {
        cell.classList.add('is-drag-path');
        if (dragIndex === state.dragPath.length - 1) {
          cell.classList.add('is-drag-tail');
        }
      }

      if (state.dragPath.some((step) => state.enemies.some((enemy) => enemy.alive && sameCoord(enemy.currentPosition, step))) && dragIndex >= 0) {
        cell.classList.add('is-path-danger');
      }

      if (sameCoord(position, state.player.position)) {
        cell.classList.add('has-player');
      }

      if (state.enemies.some((entry) => entry.alive && sameCoord(entry.currentPosition, position))) {
        cell.classList.add('has-enemy');
      }

      if (
        state.waveWarning?.active &&
        state.waveWarning.spawnPositions?.some((spawn) => sameCoord(spawn, position))
      ) {
        cell.classList.add('is-wave-warning-enemy');
      }

      if (
        state.waveWarning?.active &&
        state.waveWarning.mysterySpawnPositions?.some((spawn) => sameCoord(spawn, position))
      ) {
        cell.classList.add('is-wave-warning-mystery');
      }

      cell.append(buildCellContent(state, position));
      board.append(cell);
    }
  }

  board.addEventListener('pointerup', () => actions.commitDragPath());
  board.addEventListener('pointercancel', () => actions.commitDragPath());
  board.addEventListener('dragstart', (event) => event.preventDefault());
  return board;
}

function renderHud(state, actions) {
  const title = state.phase === PHASES.EnemyTurn
    ? 'Gameplay · EnemyTurn'
    : state.phase === PHASES.ReachablePreview
      ? 'Gameplay · ReachablePreview'
      : 'Gameplay · BeforeRoll';
  const { shell, body } = createScreenFrame(title, 'Board readability + mobile HUD');

  const hud = document.createElement('div');
  hud.className = 'wire-hud-row modern';
  const moveText = state.rolledMove ? `${state.player.moveMin}-${state.rolledMove}` : `${state.player.moveMin}-${state.player.moveMax}`;
  hud.append(
    createHudChip(`❤️ HP: ${state.player.hp.current}`, state.rewardFeedback?.target === 'hp' ? 'is-flashing' : ''),
    createHudChip(`⚔️ Dmg: ${state.player.dmg.min}-${state.player.dmg.max}`, state.rewardFeedback?.target === 'dmg' ? 'is-flashing' : ''),
    createHudChip(`🎲 Move: ${moveText}`),
    createHudChip(`⚡ Power: ${getPlayerVisiblePower(state.player)}`)
  );
  if (state.runMode === 'main') {
    hud.append(createPhaseChip(state.dayNight));
  }

  const info = document.createElement('div');
  info.className = 'wire-info';
  const waveText = `Wave ${state.currentWaveIndex + 1}/${state.totalWaves}`;
  const previewText = state.phase === PHASES.ReachablePreview ? ` | ${state.dragPreviewText}` : '';
  const phaseCue = state.phaseCue ? ` | ${state.phaseCue}` : '';
  info.textContent = `${waveText} | ${state.message}${previewText}${phaseCue}`;

  const topRow = document.createElement('div');
  topRow.className = 'hud-top-row';
  const leftTop = document.createElement('div');
  leftTop.className = 'hud-top-left';
  if (state.runMode === 'main') {
    leftTop.append(createPhaseBadge(state));
  }
  const wavePill = document.createElement('div');
  wavePill.className = 'ui-pill';
  wavePill.textContent = `⚠️ ${waveText}`;
  leftTop.append(wavePill);
  const bagTarget = document.createElement('div');
  if (state.runMode === 'main') {
    bagTarget.className = `hud-bag-target ${state.hudBagPulse ? 'is-pulsing' : ''}`;
    bagTarget.textContent = '🎒 Loot Bag';
    topRow.append(leftTop, bagTarget);
  } else {
    topRow.append(leftTop);
  }

  const actionsRow = document.createElement('div');
  actionsRow.className = 'button-row';
  const canUsePlayerTurnControls = state.phase === PHASES.BeforeRoll || state.phase === PHASES.ReachablePreview;
  actionsRow.append(
    createActionButton('🎲 Roll', actions.rollMove, state.phase !== PHASES.BeforeRoll),
    createActionButton('⏭️ Skip Turn', actions.skipTurn, state.phase !== PHASES.BeforeRoll),
    createActionButton(
      state.enemyThreatPreviewEnabled ? '👁️ Threat: ON' : '👁️ Threat: OFF',
      actions.toggleEnemyThreatPreview,
      !canUsePlayerTurnControls
    )
  );

  const objective = document.createElement('div');
  objective.className = 'panel objective-panel';
  objective.innerHTML = `
    <div class="panel-row"><span>⚠️ Objective</span><span>defeat_all</span></div>
    <div class="panel-note">
      ${state.phase === PHASES.EnemyTurn
        ? 'Enemy turn is resolving sequentially. Player input is disabled.'
        : state.phase === PHASES.ReachablePreview
          ? 'Path preview only. Character remains on current tile until release-to-commit.'
          : 'Read the board, compare power, then roll to begin planning your path.'}
    </div>
  `;

  body.append(topRow, hud, info, renderBoard(state, actions), objective, actionsRow);
  return shell;
}

function buildFighterBlock(label, stats, role, animation) {
  const block = document.createElement('div');
  block.className = `fighter-block combat-fighter-card ${role === 'player' ? 'is-player' : 'is-enemy'}`;

  if (animation?.actor === role) {
    block.classList.add(`is-${animation.phase}`, `is-acting-${role}`);
  }

  if (animation?.target === role && ['impact', 'recoil', 'resolved'].includes(animation?.phase)) {
    block.classList.add(`is-${animation.phase}`, 'is-hit', `is-target-${role}`);
  }

  const title = document.createElement('div');
  title.className = 'combat-fighter-title';
  title.textContent = role === 'player' ? 'PLAYER' : `ENEMY · ${label.toUpperCase()}`;

  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'combat-avatar-wrap';
  if (stats.asset) {
    const icon = document.createElement('img');
    icon.className = `fighter-icon ${role}`;
    icon.setAttribute('aria-label', label);
    icon.src = stats.asset;
    icon.alt = label;
    avatarWrap.append(icon);
  } else {
    const avatar = document.createElement('div');
    avatar.className = 'combat-avatar-letter';
    avatar.textContent = role === 'player' ? 'P' : (label.trim().charAt(0).toUpperCase() || 'E');
    avatarWrap.append(avatar);
  }

  const statGrid = document.createElement('div');
  statGrid.className = 'combat-stat-grid';
  const hp = document.createElement('div');
  hp.className = 'combat-stat-chip';
  hp.innerHTML = `<small>♡ HP</small><strong>${Math.max(0, stats.hp)} / ${Math.max(0, stats.hpMax ?? stats.hp)}</strong>`;

  const dmg = document.createElement('div');
  dmg.className = 'combat-stat-chip';
  dmg.innerHTML = `<small>⚔ DMG</small><strong>${stats.dmgMin}-${stats.dmgMax}</strong>`;
  statGrid.append(hp, dmg);

  if (animation?.target === role && animation?.damage && ['impact', 'recoil', 'return'].includes(animation.phase)) {
    const popup = document.createElement('div');
    popup.className = 'damage-popup';
    popup.textContent = `-${animation.damage}`;
    block.append(popup);
  }

  block.append(title, avatarWrap, statGrid);
  return block;
}

function renderCombatLayout(state, resultText = null) {
  const section = document.createElement('section');
  section.className = 'screen screen-battle';

  const frame = document.createElement('div');
  frame.className = 'wireframe-frame battle-frame';
  const topRow = document.createElement('div');
  topRow.className = 'combat-top-row';
  topRow.innerHTML = `
    <div class="combat-pill">Attacker goes first</div>
    <div class="combat-pill">${state.runMode === 'main'
      ? (state.dayNight?.phase === 'Night' ? '🌙 Night · Enemy pressure high' : '☀️ Day · Safer attack window')
      : '🧩 Rune Trial'}</div>
  `;

  if (resultText) {
    const result = document.createElement('div');
    result.className = 'battle-result-text';
    result.textContent = resultText;
    frame.append(result);
  }

  const enemy = state.modal?.enemy || state.lastCombatEnemy || state.enemies.find((entry) => entry.alive) || {
    label: 'Enemy',
    currentHp: 0,
    hp: 0,
    dmgMin: 0,
    dmgMax: 0,
    asset: './src/ui/assets/enemy-slime.png'
  };

  const row = document.createElement('div');
  row.className = 'combat-cards-row';
  const animation = state.modal?.animation || null;
  row.append(
    buildFighterBlock(
      'Player',
      {
        hp: state.player.hp.current,
        hpMax: state.player.hp.max,
        dmgMin: state.player.dmg.min,
        dmgMax: state.player.dmg.max,
        asset: BASELINE_PLAYER_CONFIG.asset,
        moveSpeedMin: state.player.moveMin,
        moveSpeedMax: state.player.moveMax
      },
      'player',
      animation
    ),
    buildFighterBlock(
      enemy.label,
      {
        hp: enemy.currentHp,
        hpMax: enemy.hp,
        dmgMin: enemy.dmgMin,
        dmgMax: enemy.dmgMax,
        asset: enemy.asset,
        moveSpeedMin: enemy.moveSpeedMin,
        moveSpeedMax: enemy.moveSpeedMax
      },
      'enemy',
      animation
    )
  );

  frame.append(topRow, row);
  section.append(frame);
  return section;
}

function renderCombatScreen(state, actions) {
  const combat = renderCombatLayout(state, null);
  const frame = combat.querySelector('.battle-frame');

  const log = document.createElement('div');
  log.className = 'wire-combat-log';
  log.innerHTML = `<div class="combat-log-head"><strong>Combat log</strong><span>Turn-based exchanges</span></div>`;
  (state.modal.log || []).slice(-6).forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'combat-log-line';
    row.textContent = entry;
    log.append(row);
  });

  frame?.append(log);

  if (state.modal?.awaitingContinue) {
    const continueText = document.createElement('button');
    continueText.className = 'combat-continue-text';
    continueText.textContent = 'Click to continue !!!';
    continueText.addEventListener('click', () => actions.closeModal());
    frame?.append(continueText);
  }
  return combat;
}

function renderEnemyIntroModal(state, actions) {
  const modal = document.createElement('div');
  modal.className = 'overlay';
  modal.innerHTML = `
    <div class="overlay-card modern-card">
      <h3>👁️ Enemy Intro</h3>
      <p><strong>${state.modal.enemy.label}</strong></p>
      <p>${state.modal.enemy.introText}</p>
      <div class="mini-stats">
        <span>⚡ Power ${getEnemyVisiblePower(state.modal.enemy)}</span>
        <span>⚔️ DMG ${state.modal.enemy.dmgMin}-${state.modal.enemy.dmgMax}</span>
        <span>🎲 SPD ${state.modal.enemy.moveSpeedMin}-${state.modal.enemy.moveSpeedMax}</span>
      </div>
    </div>
  `;

  const button = createActionButton('▶️ Continue', actions.closeModal);
  modal.querySelector('.overlay-card').append(button);
  return modal;
}

function renderBattlefieldBagOfferModal(state, actions) {
  const modal = document.createElement('div');
  modal.className = 'overlay';

  const card = document.createElement('div');
  card.className = 'overlay-card battlefield-bag';

  const title = document.createElement('h3');
  title.textContent = '🎒 Battlefield Bag';

  const help = document.createElement('p');
  help.className = 'bag-item-desc';
  help.textContent = `✨ ${state.modal.sourceLabel} | Choose 1 offer (progress + recovery + wildcard).`;

  const offers = document.createElement('div');
  offers.className = 'bag-offers';
  (state.modal.offers || []).forEach((entry) => {
    const info = entry.cardInfo || {};
    const statLines = (info.affectedStats || [])
      .map((stat) => `<span>${getStatIcon(stat.stat)} ${stat.stat}: ${stat.current} -> ${stat.next}</span>`)
      .join('');
    const tagClass = info.stateTag === 'Upgrade' ? 'bag-tag is-upgrade' : 'bag-tag';
    const button = document.createElement('button');
    button.className = 'bag-offer';
    const itemEmoji = getBagItemEmoji(info);
    button.innerHTML = `
      <strong>${itemEmoji} ${entry.item?.name || entry.itemName}</strong>
      <span class="${tagClass}">🏷️ Tag: ${info.stateTag || 'New'} | Lv ${info.currentLevel || 0} -> ${info.nextLevel || entry.nextLevel}</span>
      <span>🔗 Recipe: ${formatRecipeText(info.recipeRelation)}</span>
      ${statLines}
    `;
    button.addEventListener('click', () => actions.selectBagOffer(entry.itemId));
    offers.append(button);
  });

  const slots = document.createElement('div');
  slots.className = 'bag-slots';
  (state.modal.bagView || []).forEach((slot) => {
    const shell = document.createElement('div');
    shell.className = 'bag-slot-shell';
    const slotItem = document.createElement('div');
    slotItem.className = 'bag-slot';

    const icon = document.createElement('span');
    icon.className = 'bag-slot-icon';
    icon.textContent = slot.empty ? '⬜' : getItemEmojiById(slot.itemId);
    slotItem.append(icon);

    const name = document.createElement('div');
    name.className = 'bag-slot-name';
    name.textContent = slot.empty
      ? `${slot.slotIndex + 1}. Empty`
      : `${slot.slotIndex + 1}. ${slot.itemName}${slot.level ? ` Lv${slot.level}` : ' [Fusion]'}`;

    shell.append(slotItem, name);
    slots.append(shell);
  });

  const row = document.createElement('div');
  row.className = 'button-row';
  row.append(
    createActionButton(
      state.modal.rerollRemaining > 0 ? `Reroll (${state.modal.rerollRemaining})` : 'Reroll (0)',
      actions.rerollBagOffer,
      state.modal.rerollRemaining <= 0
    )
  );
  row.firstChild.textContent = state.modal.rerollRemaining > 0
    ? `🔄 Reroll (${state.modal.rerollRemaining})`
    : '🔄 Reroll (0)';
  row.append(createActionButton('⏭️ Skip Pick', actions.skipBagOffer));

  card.append(title, help, offers, slots, row);
  modal.append(card);
  return modal;
}

function renderBattlefieldBagSwapModal(state, actions) {
  const modal = document.createElement('div');
  modal.className = 'overlay';

  const card = document.createElement('div');
  card.className = 'overlay-card battlefield-bag';
  const title = document.createElement('h3');
  title.textContent = state.modal?.allowEmptySlots
    ? `🎒 Place or Swap: ${state.modal.item?.name || 'Item'}`
    : `🎒 Bag Full: ${state.modal.item?.name || 'Item'}`;

  const slots = document.createElement('div');
  slots.className = 'bag-slots';
  (state.modal.bagView || []).forEach((slot) => {
    const shell = document.createElement('div');
    shell.className = 'bag-slot-shell';
    const button = document.createElement('button');
    button.className = 'bag-slot';

    const icon = document.createElement('span');
    icon.className = 'bag-slot-icon';
    icon.textContent = slot.empty ? '⬜' : getItemEmojiById(slot.itemId);
    button.append(icon);

    const name = document.createElement('div');
    name.className = 'bag-slot-name';
    name.textContent = slot.empty
      ? `${slot.slotIndex + 1}. Empty`
      : `${slot.slotIndex + 1}. ${slot.itemName}${slot.level ? ` Lv${slot.level}` : ' [Fusion]'}`;

    button.disabled = !state.modal?.allowEmptySlots && slot.empty;
    button.addEventListener('click', () => actions.swapBagSlot(slot.slotIndex));
    shell.append(button, name);
    slots.append(shell);
  });

  const row = document.createElement('div');
  row.className = 'button-row';
  row.append(createActionButton('↩️ Cancel', actions.cancelBagSwap));

  card.append(title, slots, row);
  modal.append(card);
  return modal;
}

function renderBattlefieldFusionModal(state, actions) {
  const modal = document.createElement('div');
  modal.className = 'overlay';

  const card = document.createElement('div');
  card.className = 'overlay-card battlefield-bag';
  const title = document.createElement('h3');
  title.textContent = '✨ Fusion Ready';

  const list = document.createElement('div');
  list.className = 'bag-offers';
  (state.modal.fusions || []).forEach((fusion) => {
    const button = document.createElement('button');
    button.className = 'bag-offer';
    button.innerHTML = `
      <strong>✨ ${fusion.name}</strong>
      <span>🔗 ${fusion.recipe.join(' + ')}</span>
    `;
    button.addEventListener('click', () => actions.fuseBagItem(fusion.fusionId));
    list.append(button);
  });

  const row = document.createElement('div');
  row.className = 'button-row';
  row.append(createActionButton('⏭️ Skip Fusion', actions.skipBagFusion));

  card.append(title, list, row);
  modal.append(card);
  return modal;
}

function renderTextOverlay(text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'result-overlay';
  wrapper.innerHTML = `
    <div class="result-center ${text === 'LOSE' ? 'lose' : 'win'}">
      <div class="result-icon">${text === 'LOSE' ? '💀' : '🏆'}</div>
      <div class="result-text">${text}</div>
      <div class="result-note">${text === 'LOSE' ? 'Return to Home' : 'Next: power-up selection'}</div>
    </div>
  `;
  return wrapper;
}

function renderRunResultModal(state, actions) {
  const modal = document.createElement('div');
  modal.className = 'overlay';
  const card = document.createElement('div');
  card.className = 'overlay-card run-result-modal';
  const result = state.runResultTable || {};
  const equipmentObtained = Array.isArray(result.equipmentObtained) ? result.equipmentObtained : [];
  card.innerHTML = `
    <h3>Run Result</h3>
    <div class="run-result-grid">
      <div><span>Outcome</span><strong>${result.result || '-'}</strong></div>
      <div><span>Enemies killed</span><strong>${Number(result.enemiesKilled || 0)}</strong></div>
      <div><span>Gold earned</span><strong>${Number(result.goldEarned || 0)}</strong></div>
    </div>
    <div class="run-result-rewards">
      <div class="run-result-reward-title">Equipment obtained during run</div>
      ${equipmentObtained.length > 0
        ? `<ul>${equipmentObtained.map((entry) => `<li>${entry}</li>`).join('')}</ul>`
        : '<div class="run-result-empty">No equipment obtained.</div>'}
    </div>
  `;
  const row = document.createElement('div');
  row.className = 'button-row';
  row.append(createActionButton('Continue', actions.closeModal));
  card.append(row);
  modal.append(card);
  return modal;
}

function renderRollAnnouncement(value) {
  const wrapper = document.createElement('div');
  wrapper.className = 'roll-announcement';
  wrapper.innerHTML = `
    <div class="roll-announcement-card">
      <div class="roll-announcement-label">🎲 Roll</div>
      <div class="roll-announcement-value">${value}</div>
    </div>
  `;
  return wrapper;
}

export function renderApp(root, state, actions) {
  root.innerHTML = '';

  if (state.screen === SCREENS.home) {
    if (state.homeView === 'goldTechTree') {
      root.append(renderGoldTechTreeScreen(state, actions));
    } else if (state.homeView === 'equipment') {
      root.append(renderEquipmentScreen(state, actions));
    } else if (state.homeView === 'modes') {
      root.append(renderModesScreen(state, actions));
    } else if (state.homeView === 'runeTrialStages') {
      root.append(renderRuneTrialStageSelectScreen(state, actions));
    } else {
      root.append(renderHomeScreen(state, actions));
    }
  } else {
    root.append(renderHud(state, actions));
  }

  if (state.screen === SCREENS.combat && state.modal?.type === 'combat') {
    root.append(renderCombatScreen(state, actions));
  }

  if (state.modal?.type === 'enemyIntro') {
    root.append(renderEnemyIntroModal(state, actions));
  }

  if (state.modal?.type === 'battlefieldBagOffer') {
    root.append(renderBattlefieldBagOfferModal(state, actions));
  }

  if (state.modal?.type === 'battlefieldBagSwap') {
    root.append(renderBattlefieldBagSwapModal(state, actions));
  }

  if (state.modal?.type === 'battlefieldBagFusion') {
    root.append(renderBattlefieldFusionModal(state, actions));
  }

  if (state.modal?.type === 'runResult') {
    root.append(renderRunResultModal(state, actions));
  }

  if (state.modal?.type === 'equipmentItemInfo') {
    root.append(renderEquipmentItemInfoModal(state, actions));
  }

  if (state.homeView === 'equipment' && state.equipmentBlacksmith) {
    root.append(renderBlacksmithModal(state, actions));
  }

  if (state.resultText) {
    root.append(renderTextOverlay(state.resultText));
    root.append(renderCombatLayout(state, state.resultText));
  }

  if (state.screen === SCREENS.gameplay && state.rollAnnouncement) {
    root.append(renderRollAnnouncement(state.rollAnnouncement));
  }
}
