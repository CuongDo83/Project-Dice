function rollBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function rollChance(chance) {
  if (!chance || chance <= 0) {
    return false;
  }
  return Math.random() < chance;
}

export const COMBAT_ANIMATION_TIMINGS = {
  prepare: 260,
  lunge: 240,
  hitStop: 110,
  recoil: 220,
  return: 280,
  settle: 200,
  nextTurnDelay: 320,
  finalReactionBuffer: 420
};

function emitCombatAnimation({
  log,
  onUpdate,
  actor,
  target,
  phase,
  damage = null
}) {
  onUpdate({
    log,
    actor,
    target,
    phase,
    damage
  });
}

async function resolveAttackSequence({
  attacker,
  target,
  minDamage,
  maxDamage,
  attackerStats,
  attackerDynamicStats = {},
  targetStats,
  attackerEntity,
  applyDamage,
  log,
  onUpdate,
  wait
}) {
  emitCombatAnimation({
    log,
    onUpdate,
    actor: attacker,
    target,
    phase: 'prepare'
  });
  await wait(COMBAT_ANIMATION_TIMINGS.prepare);

  emitCombatAnimation({
    log,
    onUpdate,
    actor: attacker,
    target,
    phase: 'lunge'
  });
  await wait(COMBAT_ANIMATION_TIMINGS.lunge);

  const rolledDamage = rollBetween(minDamage, maxDamage);
  let damage = rolledDamage;
  const critChance = (attackerStats.critChance || 0) + (attackerDynamicStats.critChance || 0);
  const critDamageBonus = (attackerStats.critDamage || 0) + (attackerDynamicStats.critDamage || 0);
  const lifesteal = (attackerStats.lifesteal || 0) + (attackerDynamicStats.lifesteal || 0);
  const isCrit = rollChance(critChance);
  let critBonusDamage = 0;
  if (isCrit) {
    const critDamage = Math.ceil(damage * (1 + critDamageBonus));
    critBonusDamage = Math.max(0, critDamage - rolledDamage);
    damage = critDamage;
  }

  const isBlocked = rollChance(targetStats.blockChance);
  const damageBeforeReduction = isBlocked ? 0 : damage;
  let finalDamage = damageBeforeReduction;
  let damageReducedByGuard = 0;
  if (finalDamage > 0 && target === 'player' && targetStats.damageTakenReduction) {
    const reducedDamage = Math.max(0, Math.floor(finalDamage * (1 - targetStats.damageTakenReduction)));
    damageReducedByGuard = Math.max(0, finalDamage - reducedDamage);
    finalDamage = reducedDamage;
  }

  applyDamage(finalDamage);
  let lifestealHealed = 0;
  if (finalDamage > 0 && lifesteal > 0 && attackerEntity?.hp) {
    const healAmount = Math.floor(finalDamage * lifesteal);
    if (healAmount > 0) {
      const beforeHeal = attackerEntity.hp.current;
      attackerEntity.hp.current = Math.min(attackerEntity.hp.max, attackerEntity.hp.current + healAmount);
      lifestealHealed = Math.max(0, attackerEntity.hp.current - beforeHeal);
    }
  }

  emitCombatAnimation({
    log,
    onUpdate,
    actor: attacker,
    target,
    phase: 'impact',
    damage: finalDamage
  });
  await wait(COMBAT_ANIMATION_TIMINGS.hitStop);

  emitCombatAnimation({
    log,
    onUpdate,
    actor: attacker,
    target,
    phase: 'recoil',
    damage: finalDamage
  });
  await wait(COMBAT_ANIMATION_TIMINGS.recoil);

  emitCombatAnimation({
    log,
    onUpdate,
    actor: attacker,
    target,
    phase: 'return',
    damage: finalDamage
  });
  await wait(COMBAT_ANIMATION_TIMINGS.return);

  emitCombatAnimation({
    log,
    onUpdate,
    actor: attacker,
    target,
    phase: 'settle',
    damage: finalDamage
  });
  await wait(COMBAT_ANIMATION_TIMINGS.settle);

  return {
    damage: finalDamage,
    isCrit,
    isBlocked,
    lifestealHealed,
    critBonusDamage,
    damageReducedByGuard,
    damageBeforeReduction
  };
}

export async function runCombat({
  player,
  enemy,
  initiator,
  playerCombatStats = {},
  enemyCombatStats = {},
  getPlayerAttackRuntimeStats,
  onUpdate,
  wait
}) {
  const log = [];
  let attacker = initiator === 'enemy' ? 'enemy' : 'player';

  let playerAttackIndex = 0;

  while (player.hp.current > 0 && enemy.currentHp > 0) {
    if (attacker === 'player') {
      const playerRuntimeStats = typeof getPlayerAttackRuntimeStats === 'function'
        ? getPlayerAttackRuntimeStats({
          attackIndex: playerAttackIndex,
          enemyCurrentHp: enemy.currentHp,
          enemyMaxHp: enemy.hp
        })
        : null;
      const playerMinDamage = Math.max(0, (playerRuntimeStats?.dmgMin ?? 0) + player.dmg.min);
      const playerMaxDamage = Math.max(
        playerMinDamage,
        (playerRuntimeStats?.dmgMax ?? 0) + player.dmg.max
      );
      const primary = await resolveAttackSequence({
        attacker: 'player',
        target: 'enemy',
        minDamage: playerMinDamage,
        maxDamage: playerMaxDamage,
        attackerStats: {
          critChance: playerCombatStats.critChance || 0,
          critDamage: playerCombatStats.critDamage || 0,
          lifesteal: playerCombatStats.lifesteal || 0,
          doubleStrike: playerCombatStats.doubleStrike || 0
        },
        attackerDynamicStats: {
          critChance: playerRuntimeStats?.critChance || 0,
          critDamage: playerRuntimeStats?.critDamage || 0,
          lifesteal: playerRuntimeStats?.lifesteal || 0
        },
        targetStats: {
          blockChance: enemyCombatStats.blockChance || 0
        },
        attackerEntity: player,
        applyDamage(amount) {
          enemy.currentHp = Math.max(0, enemy.currentHp - amount);
        },
        log,
        onUpdate,
        wait
      });
      playerAttackIndex += 1;
      log.push(`Player hits ${enemy.label} for ${primary.damage}.`);
      if (primary.isCrit) {
        log.push(
          primary.critBonusDamage > 0
            ? `Critical hit! Total ${primary.damage} damage (+${primary.critBonusDamage} bonus).`
            : `Critical hit! Total ${primary.damage} damage.`
        );
      }
      if (primary.isBlocked) {
        log.push(`${enemy.label} blocks.`);
      }
      if (primary.lifestealHealed > 0) {
        log.push(`Player lifesteals ${primary.lifestealHealed} HP.`);
      }
      emitCombatAnimation({
        log,
        onUpdate,
        actor: 'player',
        target: 'enemy',
        phase: 'resolved',
        damage: primary.damage
      });

      if (enemy.currentHp <= 0) {
        await wait(COMBAT_ANIMATION_TIMINGS.finalReactionBuffer);
        break;
      }

      if (rollChance(playerCombatStats.doubleStrike || 0)) {
        log.push('Player triggers Double Strike.');
        const extra = await resolveAttackSequence({
          attacker: 'player',
          target: 'enemy',
          minDamage: playerMinDamage,
          maxDamage: playerMaxDamage,
          attackerStats: {
            critChance: playerCombatStats.critChance || 0,
            critDamage: playerCombatStats.critDamage || 0,
            lifesteal: playerCombatStats.lifesteal || 0,
            doubleStrike: 0
          },
          attackerDynamicStats: {
            critChance: playerRuntimeStats?.critChance || 0,
            critDamage: playerRuntimeStats?.critDamage || 0,
            lifesteal: playerRuntimeStats?.lifesteal || 0
          },
          targetStats: {
            blockChance: enemyCombatStats.blockChance || 0
          },
          attackerEntity: player,
          applyDamage(amount) {
            enemy.currentHp = Math.max(0, enemy.currentHp - amount);
          },
          log,
          onUpdate,
          wait
        });
        playerAttackIndex += 1;
        log.push(`Player Double Strike hits for ${extra.damage}.`);
        if (extra.isCrit) {
          log.push(
            extra.critBonusDamage > 0
              ? `Double Strike crit! Total ${extra.damage} damage (+${extra.critBonusDamage} bonus).`
              : `Double Strike crit! Total ${extra.damage} damage.`
          );
        }
        if (extra.isBlocked) {
          log.push(`${enemy.label} blocks extra hit.`);
        }
        if (extra.lifestealHealed > 0) {
          log.push(`Player lifesteals ${extra.lifestealHealed} HP.`);
        }
        emitCombatAnimation({
          log,
          onUpdate,
          actor: 'player',
          target: 'enemy',
          phase: 'resolved',
          damage: extra.damage
        });
        if (enemy.currentHp <= 0) {
          await wait(COMBAT_ANIMATION_TIMINGS.finalReactionBuffer);
          break;
        }
      }

      await wait(COMBAT_ANIMATION_TIMINGS.nextTurnDelay);

      attacker = 'enemy';
      continue;
    }

    const primary = await resolveAttackSequence({
      attacker: 'enemy',
      target: 'player',
      minDamage: enemy.dmgMin,
      maxDamage: enemy.dmgMax,
      attackerStats: {
        critChance: enemyCombatStats.critChance || 0,
        critDamage: enemyCombatStats.critDamage || 0,
        lifesteal: enemyCombatStats.lifesteal || 0,
        doubleStrike: enemyCombatStats.doubleStrike || 0
      },
      targetStats: {
        blockChance: playerCombatStats.blockChance || 0,
        damageTakenReduction: playerCombatStats.nightDamageTakenReduction || 0
      },
      attackerEntity: enemy,
      applyDamage(amount) {
        player.hp.current = Math.max(0, player.hp.current - amount);
      },
      log,
      onUpdate,
      wait
    });
    log.push(`${enemy.label} hits player for ${primary.damage}.`);
    if (primary.isCrit) {
      log.push(
        primary.critBonusDamage > 0
          ? `${enemy.label} crits for ${primary.damage} damage (+${primary.critBonusDamage} bonus).`
          : `${enemy.label} crits for ${primary.damage} damage.`
      );
    }
    if (primary.isBlocked) {
      log.push('Player blocks.');
    }
    if (primary.damageReducedByGuard > 0) {
      log.push(`Player guard reduces ${primary.damageReducedByGuard} damage.`);
    }
    if (primary.lifestealHealed > 0) {
      log.push(`${enemy.label} lifesteals ${primary.lifestealHealed} HP.`);
    }
    emitCombatAnimation({
      log,
      onUpdate,
      actor: 'enemy',
      target: 'player',
      phase: 'resolved',
      damage: primary.damage
    });

    if (player.hp.current <= 0) {
      await wait(COMBAT_ANIMATION_TIMINGS.finalReactionBuffer);
      break;
    }

    if (rollChance(enemyCombatStats.doubleStrike || 0)) {
      log.push(`${enemy.label} triggers Double Strike.`);
      const extra = await resolveAttackSequence({
        attacker: 'enemy',
        target: 'player',
        minDamage: enemy.dmgMin,
        maxDamage: enemy.dmgMax,
        attackerStats: {
          critChance: enemyCombatStats.critChance || 0,
          critDamage: enemyCombatStats.critDamage || 0,
          lifesteal: enemyCombatStats.lifesteal || 0,
          doubleStrike: 0
        },
        targetStats: {
          blockChance: playerCombatStats.blockChance || 0,
          damageTakenReduction: playerCombatStats.nightDamageTakenReduction || 0
        },
        attackerEntity: enemy,
        applyDamage(amount) {
          player.hp.current = Math.max(0, player.hp.current - amount);
        },
        log,
        onUpdate,
        wait
      });
      log.push(`${enemy.label} Double Strike hits for ${extra.damage}.`);
      if (extra.isCrit) {
        log.push(
          extra.critBonusDamage > 0
            ? `${enemy.label} Double Strike crits for ${extra.damage} damage (+${extra.critBonusDamage} bonus).`
            : `${enemy.label} Double Strike crits for ${extra.damage} damage.`
        );
      }
      if (extra.isBlocked) {
        log.push('Player blocks extra hit.');
      }
      if (extra.damageReducedByGuard > 0) {
        log.push(`Player guard reduces ${extra.damageReducedByGuard} damage.`);
      }
      if (extra.lifestealHealed > 0) {
        log.push(`${enemy.label} lifesteals ${extra.lifestealHealed} HP.`);
      }
      emitCombatAnimation({
        log,
        onUpdate,
        actor: 'enemy',
        target: 'player',
        phase: 'resolved',
        damage: extra.damage
      });
      if (player.hp.current <= 0) {
        await wait(COMBAT_ANIMATION_TIMINGS.finalReactionBuffer);
        break;
      }
    }

    await wait(COMBAT_ANIMATION_TIMINGS.nextTurnDelay);
    attacker = 'player';
  }

  emitCombatAnimation({
    log,
    onUpdate,
    actor: null,
    target: null,
    phase: 'idle',
    damage: null
  });

  return {
    winner: player.hp.current > 0 ? 'player' : 'enemy',
    log
  };
}
