import { Card } from './Card';
export class Deck {
    static getFullDeck = function(numDecks) {
        const cards = [];
        const deckLoops = numDecks ? numDecks : 2;
        for (let i = 0; i < deckLoops; i++) {
            for (let suite = 0; suite < 4; suite++) {
                for (let card = 0; card < 13; card++) {
                    cards.push(new Card(card, suite, i%2));
                }
            }
        }

        for (let i = 0; i < (deckLoops * 4); i++) {
            cards.push(new Card(Card.IDS.JOKER, undefined, i%2));
        }
        return cards;
    };
    
    static shuffleDeck = function(deck) {
        return deck.sort(() => Math.random() - 0.5);
    };

    getNextDrawableCard() {
        return this.cards[this.cards.length - 1];
    }

    draw() {
        return this.cards.pop();
    }

    constructor(numDecks) {
        if (numDecks) {
            this.cards = Deck.shuffleDeck(Deck.getFullDeck(numDecks));
        }
        this.cards = Deck.shuffleDeck(Deck.getFullDeck());
    }
}