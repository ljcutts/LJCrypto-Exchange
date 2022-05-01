import { BigInt } from "@graphprotocol/graph-ts";
import {
  // GuessingGame,
  CurrentGame,
  Ended,
  Winners,
} from "../generated/GuessingGame/GuessingGame";
import { GuessingGame } from "../generated/schema";

export function handleCurrentGame(event: CurrentGame): void {
  let entity = GuessingGame.load(event.params.GameId.toString());

  if (!entity) {
    entity = new GuessingGame(event.params.GameId.toString());
    entity.Player = [];
  }
  let newPlayers = entity.Player;
  newPlayers.push(event.params.Player);
  entity.Player = newPlayers;

  entity.save();
}

export function handleEnded(event: Ended): void {
  let entity = GuessingGame.load(event.params.GameId.toString());

  if (!entity) {
    return;
  }

  entity.Player = [];

  entity.save();
}

export function handleWinners(event: Winners): void {
  let entity = GuessingGame.load(event.params.GameId.toString());

  if (!entity) {
    return;
  }

  entity.Winner = event.params.Winner;
  entity.requestId = event.params.requestId;
  entity.Player = [];

  entity.save();
}
