import { clearStore, test, assert, addMetadata } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { BigInt, ethereum, Address, Bytes, } from "@graphprotocol/graph-ts"
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
import { handleLogPolymorphsBattled } from "./mapping";

export function runTests(): void {
    test("Creates BattleEntity and BattleStatistic entities", () => {
          // Hidrate the store

        let entity = new BattleEntity("19");
        entity.polymorphId = BigInt.fromI32(19);
        entity.skillType = BigInt.fromI32(1)
        entity.statsMin = BigInt.fromI32(8)
        entity.statsMax = BigInt.fromI32(1000)
        entity.loses = BigInt.fromI32(0)
        entity.wins = BigInt.fromI32(0)
        entity.save();

        let entity2 = new BattleEntity("27");
        entity2.polymorphId = BigInt.fromI32(27);
        entity2.skillType = BigInt.fromI32(1)
        entity2.statsMin = BigInt.fromI32(8)
        entity2.statsMax = BigInt.fromI32(1000)
        entity2.loses = BigInt.fromI32(0)
        entity2.wins = BigInt.fromI32(0)
        entity2.save();

        // Initialise event (this can be generalised into a separate function)
        let base: ethereum.Event = new LogPolymorphsBattled();
        let battleEvent: LogPolymorphsBattled = addMetadata(base) as LogPolymorphsBattled;

        battleEvent.parameters = [];
        battleEvent.transaction.hash = Bytes.fromI32(1) as Bytes;

        let opponentOnePolymorphId = new ethereum.EventParam();
        opponentOnePolymorphId.value = ethereum.Value.fromI32(19);

        let opponentOneStats = new ethereum.EventParam();
        opponentOneStats.value = ethereum.Value.fromI32(128);

        let opponentOneSkillType = new ethereum.EventParam();
        opponentOneSkillType.value = ethereum.Value.fromI32(1);

        let opponentOneAddress = new ethereum.EventParam();
        opponentOneAddress.value = ethereum.Value.fromAddress(Address.fromString("0x5012a9a26866bd7897a71dd4fb7a65e6ffdd18f2"));

        let opponentOneRandomNumber = new ethereum.EventParam();
        let bigIntParam = BigInt.fromString("14526196533531490963798236186445154581679566712726662689077445457583415286419");
        opponentOneRandomNumber.value = ethereum.Value.fromUnsignedBigInt(bigIntParam);

        let opponentTwoPolymorphId = new ethereum.EventParam();
        opponentTwoPolymorphId.value = ethereum.Value.fromI32(27);

        let opponentTwoStats = new ethereum.EventParam();
        opponentTwoStats.value = ethereum.Value.fromI32(420);

        let opponentTwoSkillType = new ethereum.EventParam();
        opponentTwoSkillType.value = ethereum.Value.fromI32(1);

        let opponentTwoAddress = new ethereum.EventParam();
        opponentTwoAddress.value = ethereum.Value.fromAddress(Address.fromString("0x5012a9a26866bd7897a71dd4fb7a65e6ffdd18f2"));

        let opponentTwoRandomNumber = new ethereum.EventParam();
        let bigIntParam1 = BigInt.fromString("8916120779646073334181028848486145638232978673410174633725175012262491629237");
        opponentTwoRandomNumber.value = ethereum.Value.fromUnsignedBigInt(bigIntParam1);

        let winnerId = new ethereum.EventParam();
        winnerId.value = ethereum.Value.fromI32(27);

        let loserId = new ethereum.EventParam();
        loserId.value = ethereum.Value.fromI32(19);

        let wager = new ethereum.EventParam();
        let bigIntParam2 = BigInt.fromString("100000000000000000");
        wager.value = ethereum.Value.fromUnsignedBigInt(bigIntParam2);

        let roundIndex = new ethereum.EventParam();
        roundIndex.value = ethereum.Value.fromI32(1);

        battleEvent.parameters.push(opponentOnePolymorphId)
        battleEvent.parameters.push(opponentOneStats)
        battleEvent.parameters.push(opponentOneSkillType)
        battleEvent.parameters.push(opponentOneAddress)
        battleEvent.parameters.push(opponentOneRandomNumber)
        battleEvent.parameters.push(opponentTwoPolymorphId)
        battleEvent.parameters.push(opponentTwoStats)
        battleEvent.parameters.push(opponentTwoSkillType)
        battleEvent.parameters.push(opponentTwoAddress)
        battleEvent.parameters.push(opponentTwoRandomNumber)
        battleEvent.parameters.push(winnerId)
        battleEvent.parameters.push(loserId)
        battleEvent.parameters.push(wager)
        battleEvent.parameters.push(roundIndex)

        // Call mappings
        handleLogPolymorphsBattled(battleEvent);

        let id = entity.polymorphId.toHex() + battleEvent.transaction.hash.toHex()
        // Assert the state of the store
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentOnePolymorphId", "19");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentOneStats", "128");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentOneSkillType", "1");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentOneAddress", "0x5012a9a26866bd7897a71dd4fb7a65e6ffdd18f2");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentOneRandomNumber", "14526196533531490963798236186445154581679566712726662689077445457583415286419");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentTwoPolymorphId", "27");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentTwoStats", "420");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentTwoSkillType", "1");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentTwoAddress", "0x5012a9a26866bd7897a71dd4fb7a65e6ffdd18f2");
        assert.fieldEquals("BattleStatistic", id.toString(), "opponentTwoRandomNumber", "8916120779646073334181028848486145638232978673410174633725175012262491629237");
        assert.fieldEquals("BattleStatistic", id.toString(), "winnerId", "27");
        assert.fieldEquals("BattleStatistic", id.toString(), "loserId", "19");
        assert.fieldEquals("BattleStatistic", id.toString(), "wager", "100000000000000000");
        assert.fieldEquals("BattleStatistic", id.toString(), "roundIndex", "1");


        // Clear the store before the next test (optional)
        clearStore();
    });
}