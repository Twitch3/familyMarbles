import { Card } from './Card';
export class Deck {
    static getFullDeck = function(numDecks) {
        const cards = [];
        const deckLoops = numDecks ? numDecks : 2;
        for (let i = 0; i < deckLoops; i++) {
            for (let suite = 0; suite < 4; suite++) {
                for (let card = 1; card < 14; card++) {
                    cards.push(new Card(card, suite));
                }
            }
        }

        for (let i = 0; i < deckLoops * 4; i++) {
            cards.push(new Card(Card.IDS.JOKER));
        }
        return cards;
    };
    
    static shuffleDeck = function(deck) {
        return deck.sort(() => Math.random() - 0.5);
    };

    constructor(numDecks) {
        if (numDecks) {
            this.cards = Deck.shuffleDeck(Deck.getFullDeck(numDecks));
        }
        this.cards = Deck.shuffleDeck(Deck.getFullDeck());
    }
}