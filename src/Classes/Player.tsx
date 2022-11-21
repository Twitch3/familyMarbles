import { IMarble, Marble } from "./Marble";
import { Cell } from "./Cell";
import { ICard } from "./Card";
import { Deck, IDeck } from "./Deck";
import { CellMap, ICellMap } from "./CellMap";

export interface IPlayer {
  id: number;
  color: string;
  hand: ICard[];
  marbles: IMarble[];
}

export class Player implements IPlayer {
  id: number;
  color: string;
  hand: ICard[];
  marbles: IMarble[];

  constructor(playerId: number, deck: IDeck, cellMap: ICellMap) {
    this.id = playerId;
    this.color = "#000";

    const hand = [];
    const marbles = [];
    for (let j = 0; j < 5; j++) {
      hand.push(Deck.draw(deck));
      const marble: IMarble = Marble.buildMarble(playerId, j);
      const key = playerId + '/' + j + '/' + Cell.TYPES.BASE;
      const baseCell = CellMap.getMapCell(cellMap, key);
      CellMap.setMarbleInMapCell(cellMap, marble, baseCell);
      marbles.push(marble);
    }

    this.hand = hand;
    this.marbles = marbles;
  }

  endTurn(selectedCardIndexes: number[], deck: Deck) {
    const newHand = [];
    this.hand.forEach((card, index) => {
      if (selectedCardIndexes.indexOf(index) === -1) {
        newHand.push(card);
      }
    });
    for (let i = 0; i < selectedCardIndexes.length; i++) {
      newHand.push(deck.draw());
    }
    this.hand = newHand;
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      color: this.color,
      hand: this.hand.toString(),
      marbles: this.marbles.toString(),
    });
  }

  toSerializable(): IPlayer {
    const serializableHand: ICard[] = []
    this.hand.forEach((card: ICard) => {
        serializableHand.push({
            id: card.id,
            suite: card.suite,
            cardBackColor: card.cardBackColor,
            amount: card.amount
        });
    });
    const serializableMarbles: IMarble[] = [];
    this.marbles.forEach((marble: IMarble) => {
        serializableMarbles.push({
            playerId: marble.playerId,
            id: marble.id
        });
    });
    return {
      id: this.id,
      color: this.color,
      hand: serializableHand,
      marbles: serializableMarbles,
    };
  }
}
