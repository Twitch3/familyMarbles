import { Card, ICard } from "./Card";

export interface IDeck {
  cards: ICard[];
}

export class Deck implements IDeck {
  cards: Card[];
  static getFullDeck = function (numDecks?: number) {
    const cards = [];
    const deckLoops = numDecks ? numDecks : 2;
    for (let i = 0; i < deckLoops; i++) {
      for (let suite = 0; suite < 4; suite++) {
        for (let card = 0; card < 13; card++) {
          cards.push(new Card(card, suite, i % 2));
        }
      }
    }

    for (let i = 0; i < deckLoops * 4; i++) {
      cards.push(new Card(Card.IDS.JOKER, undefined, i % 2));
    }
    return cards;
  };

  static shuffleCardArray = function (deck: Card[]) {
    return deck.sort(() => Math.random() - 0.5);
  };

  getNextDrawableCard() {
    return this.cards[this.cards.length - 1];
  }

  draw() {
    let nextCard: Card | undefined = this.cards.pop();
    if (nextCard) {
      return nextCard;
    } else {
      this.cards = Deck.shuffleCardArray(Deck.getFullDeck());
      return this.cards.pop() as Card; //Forcing type as we know the value cannot be undefined.
    }
  }

  static draw(deck: IDeck): ICard {
    let nextCard: ICard | undefined = deck.cards.pop();
    if (nextCard) {
      return nextCard;
    } else {
      deck.cards = Deck.shuffleCardArray(Deck.getFullDeck());
      return deck.cards.pop() as ICard; //Forcing type as we know the value cannot be undefined.
    }
  }

  constructor(numDecks?: number) {
    if (numDecks) {
      this.cards = Deck.shuffleCardArray(Deck.getFullDeck(numDecks));
    }
    this.cards = Deck.shuffleCardArray(Deck.getFullDeck());
  }

  toString() {
    return JSON.stringify(this.cards);
  }

  toSerializable(): IDeck {
    const serializableCards: ICard[] = [];
    this.cards.forEach((card: Card) => {
      serializableCards.push({
        id: card.id,
        suite: card.suite,
        cardBackColor: card.cardBackColor,
        amount: card.amount,
      })
    });
    return {
      cards: serializableCards
    }
  }
}
