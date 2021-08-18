import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  Contract,
  LogBattleEntered,
  LogLinkExchanged,
  LogPolymorphsBattled,
  LogRewardsClaimed,
  LogRoundExecuted,
  LogRoundStarted
} from "../generated/Contract/Contract"
import { BattleEntity, BattleStatistic } from "../generated/schema"

export function handleLogBattleEntered(event: LogBattleEntered): void {
  let id = event.params.polymorphId;
  let entity = BattleEntity.load(id.toString())

  if (entity == null) {
    entity = new BattleEntity(id.toString())

    entity.loses = BigInt.fromI32(0)
    entity.wins = BigInt.fromI32(0)
  }

  entity.polymorphId = event.params.polymorphId;
  entity.skillType = event.params.skillType;
  entity.statsMin = event.params.minStats;
  entity.statsMax = event.params.maxStats;
  entity.save();
}

export function handleLogLinkExchanged(event: LogLinkExchanged): void {}

export function handleLogPolymorphsBattled(event: LogPolymorphsBattled): void {
  let firstPolymorphId = event.params.firstPolymorphId
  let secondPolymorphId = event.params.secondPolymorphId
  let winnerId = event.params.winnerId

  let entity1 = BattleEntity.load(firstPolymorphId.toString())
  let entity2 = BattleEntity.load(secondPolymorphId.toString())

  if (entity1 == null || entity2 == null) {
    log.debug('DEBUG INFO:: NO entity with id {} or {}, has been created, please investigate !', [firstPolymorphId.toString(), secondPolymorphId.toString()]);
    return
  }

  // Update win/lose ratio of the entities
  // if (firstPolymorphId == winnerId) {
  //   entity1.wins = entity1.wins.plus(BigInt.fromI32(1));
  //   entity1.accumulatedWeiBalance = entity1.accumulatedWeiBalance.plus(event.params.wager);
  //   entity2.loses = entity2.loses.plus(BigInt.fromI32(1));
  //   entity2.accumulatedWeiBalance = entity2.accumulatedWeiBalance.minus(event.params.wager);
  // } else {
  //   entity2.wins = entity2.wins.plus(BigInt.fromI32(1));
  //   entity1.accumulatedWeiBalance = entity1.accumulatedWeiBalance.plus(event.params.wager);
  //   entity1.loses = entity1.loses.plus(BigInt.fromI32(1));
  //   entity1.accumulatedWeiBalance = entity1.accumulatedWeiBalance.minus(event.params.wager);
  // }

  entity1.save();
  entity2.save();

  // Save the battle history
  let history = new BattleStatistic(firstPolymorphId.toHex() + event.transaction.hash.toHex())
  history.opponentOnePolymorphId = event.params.firstPolymorphId;
  history.opponentOneSkillType = event.params.firstPolymorphSkillType;
  history.opponentOneStats = event.params.firstPolymorphStats;
  history.opponentOneRandomNumber = event.params.firstPolymorphRandomNumber;
  history.opponentOneAddress = event.params.firstPolymorphAddress;
  history.opponentOneRandomNumber = event.params.firstPolymorphRandomNumber;
  history.opponentTwoPolymorphId = event.params.secondPolymorphId;
  history.opponentTwoSkillType = event.params.secondPolymorphSkillType;
  history.opponentTwoStats = event.params.secondPolymorphStats;
  history.opponentTwoRandomNumber = event.params.secondPolymorphRandomNumber;
  history.opponentTwoAddress = event.params.secondPolymorphAddress;
  history.opponentTwoRandomNumber = event.params.secondPolymorphRandomNumber;
  history.winnerId = event.params.winnerId;
  history.loserId = event.params.loserId;
  history.wager = event.params.wager;
  history.roundIndex = event.params.roundIndex;
  history.save();
}

export function handleLogRewardsClaimed(event: LogRewardsClaimed): void {}

export function handleLogRoundExecuted(event: LogRoundExecuted): void {}

export function handleLogRoundStarted(event: LogRoundStarted): void {}


export { runTests } from "./mapping.test";
