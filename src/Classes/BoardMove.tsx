import { Card } from "./Card";
import { IPlayer } from "./Player";

export interface IBoardMove {
  playerId: number;
  amount: number;
  types: number[]; // TODO: Is there a better way to represent types? Enums please.
}

export class BoardMove implements IBoardMove {
  static TYPES = {
    BASE_EXIT: 0,
    FORWARD: 1,
    BACKWARD: 2,
    JOKER: 3,
    SPLIT: 4,
  };
  
  playerId: number;
  amount: number;
  types: number[]; // TODO: Is there a better way to represent types? Enums please.
  
  constructor(player: IPlayer, selectedIndexes: number[]) {
    const playerHand = player.hand;
    this.playerId = player.id;
    const numCards = selectedIndexes.length;
    if (numCards > 0) {
      const card = playerHand[selectedIndexes[0]];
      const cardType = card.id;
      if (numCards === 2) {
        this.amount = 1;
        this.types = [BoardMove.TYPES.BASE_EXIT];
      } else {
        if (cardType === Card.IDS.JOKER) {
          this.amount = 1;
          this.types = [BoardMove.TYPES.JOKER];
        } else if (cardType === Card.IDS.SEVEN) {
          this.amount = 7;
          this.types = [BoardMove.TYPES.FORWARD, BoardMove.TYPES.SPLIT];
        } else if (
          numCards === 1 &&
          (cardType === Card.IDS.JACK ||
            cardType === Card.IDS.QUEEN ||
            cardType === Card.IDS.KING ||
            cardType === Card.IDS.ACE)
        ) {
          this.amount = card.amount;
          this.types = [BoardMove.TYPES.BASE_EXIT, BoardMove.TYPES.FORWARD];
        } else {
          this.amount = card.amount * numCards;
          this.types =
            cardType === Card.IDS.EIGHT
              ? [BoardMove.TYPES.BACKWARD]
              : [BoardMove.TYPES.FORWARD];
        }
      }
    } else {
      this.amount = 0;
      this.types = [BoardMove.TYPES.FORWARD];
    }
  }

  canBeBaseExit() {
    return this.types.indexOf(BoardMove.TYPES.BASE_EXIT) >= 0;
  }

  canBeForward() {
    return this.types.indexOf(BoardMove.TYPES.FORWARD) >= 0;
  }

  canBeBackward() {
    return this.types.indexOf(BoardMove.TYPES.BACKWARD) >= 0;
  }

  canBeSplit() {
    return this.types.indexOf(BoardMove.TYPES.SPLIT) >= 0;
  }

  isJoker() {
    return this.types.indexOf(BoardMove.TYPES.JOKER) >= 0;
  }
}
