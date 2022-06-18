import { BigInt } from "@graphprotocol/graph-ts";
import {
  PlayersOnLotteryDay,
  Winners,
} from "../generated/LotteryGame/LotteryGame";
import { LotteryGame } from "../generated/schema";

export function handlePlayersOnLotteryDay(event: PlayersOnLotteryDay): void {
  let entity = LotteryGame.load(event.params.lotteryDay.toString());
  if (!entity) {
    entity = new LotteryGame(event.params.lotteryDay.toString());
  }
  entity.entryAmount = event.params.entryAmount;
  let newPlayers = entity.player;
  newPlayers.push(event.params.player);
  entity.player = newPlayers;
  entity.save();
}

export function handleWinners(event: Winners): void {
  let entity = LotteryGame.load(event.params.lotteryDay.toString());
  if (!entity) {
    entity = new LotteryGame(event.params.lotteryDay.toString());
  }
  let winners = entity.winner;
  winners.push(event.params.winner);
  entity.winner = winners;
  entity.requestId = event.params.requestId;
  entity.save();
}
