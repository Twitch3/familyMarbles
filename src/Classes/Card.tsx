import cards from "../Assets/cards.png";

export interface ICard {
  // TODO: Replace with enums please.
  id: number;
  suite?: number;
  cardBackColor: number;
  amount: number;
}

export class Card implements ICard {
  static IDS = {
    ACE: 0,
    TWO: 1,
    THREE: 2,
    FOUR: 3,
    FIVE: 4,
    SIX: 5,
    SEVEN: 6,
    EIGHT: 7,
    NINE: 8,
    TEN: 9,
    JACK: 10,
    QUEEN: 11,
    KING: 12,
    JOKER: 13,
  };

  static SUITES = {
    CLUBS: 0,
    SPADES: 1,
    HEARTS: 2,
    DIAMONDS: 3,
  };

  static CARD_BACK_COLORS = {
    RED: 0,
    BLUE: 1,
  };

  // TODO: Replace with enums please.
  id: number;
  suite?: number;
  cardBackColor: number;
  amount: number;

  equals(otherCard: Card) {
    return this.id === otherCard.id;
  }

  getSpriteCoordinates() {
    let xIndex = this.id;
    let yIndex = this.suite;

    if (!yIndex && yIndex !== 0) {
      xIndex = 13;
      yIndex = 2 + this.cardBackColor;
    }
    return {
      backgroundImage: "url(" + cards + ")",
      backgroundPositionX: -xIndex * 72 + "px",
      backgroundPositionY: -yIndex * 96 + "px",
      border: "none",
    };
  }
  
  static getSpriteCoordinates(card: ICard) {
    let xIndex = card.id;
    let yIndex = card.suite;

    if (!yIndex && yIndex !== 0) {
      xIndex = 13;
      yIndex = 2 + card.cardBackColor;
    }
    return {
      backgroundImage: "url(" + cards + ")",
      backgroundPositionX: -xIndex * 72 + "px",
      backgroundPositionY: -yIndex * 96 + "px",
      border: "none",
    };
  }

  static getCardBackCoordinates(card: ICard) {
    return {
      backgroundImage: "url(" + cards + ")",
      backgroundPositionX: -13 * 72 + "px",
      backgroundPositionY: -card.cardBackColor * 96 + "px",
      border: "none",
    };
  }

  getCardBackCoordinates() {
    return {
      backgroundImage: "url(" + cards + ")",
      backgroundPositionX: -13 * 72 + "px",
      backgroundPositionY: -this.cardBackColor * 96 + "px",
      border: "none",
    };
  }

  toString() {
    const cardState = {
      id: this.id,
      suite: this.suite,
      cardBackColor: this.cardBackColor,
      amount: this.amount,
    };
    return JSON.stringify(cardState);
  }

  toSerializable(): ICard {
    return {
      id: this.id,
      suite: this.suite,
      cardBackColor: this.cardBackColor,
      amount: this.amount,
    }
  }

  constructor(cardId: number, cardSuite: number | undefined, cardBack: number) {
    this.id = cardId;
    this.amount = 1 + cardId;
    this.suite = cardSuite;
    this.cardBackColor = cardBack;
  }

  static createFromJSONString(cardString: string): Card {
    const cardJSON: ICard = JSON.parse(cardString);
    return new Card(cardJSON.id, cardJSON.suite, cardJSON.cardBackColor);
  }
}
