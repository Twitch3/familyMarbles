export class Card {
    static IDS = {
        JOKER: 0,
        ACE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        SIX: 6,
        SEVEN: 7,
        EIGHT: 8,
        NINE: 9,
        TEN: 10,
        JACK: 11,
        QUEEN: 12,
        KING: 13
    };

    static SUITES = {
        CLUBS: 0,
        SPADES: 1,
        DIAMONDS: 2,
        HEARTS: 3,
    };

    equals(otherCard) {
        return this.id === otherCard.id;
    }
    
    constructor(cardId, cardSuite) {
        this.id = cardId;
        this.suite = cardSuite;
    }
}