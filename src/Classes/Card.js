import cards from '../Assets/cards.png';
export class Card {
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
        JOKER: 13
    };

    static SUITES = {
        CLUBS: 0,
        SPADES: 1,
        HEARTS: 2,
        DIAMONDS: 3
    };

    static CARD_BACK_COLORS = {
        RED: 0,
        BLUE: 1
    }

    equals(otherCard) {
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
            backgroundImage: 'url('+cards+')',
            backgroundPositionX: -xIndex * 72 + 'px',
            backgroundPositionY: -yIndex * 96 + 'px',
            border: 'none'
        }
    }

    getCardBackCoordinates() {
        return {
            backgroundImage: 'url('+cards+')',
            backgroundPositionX: -13 * 72 + 'px',
            backgroundPositionY: -this.cardBackColor * 96 + 'px',
            border: 'none'
        }
    }

    toString() {
        return this.suite + ' ' + this.id;
    }
    
    constructor(cardId, cardSuite, cardBack) {
        this.id = cardId;
        this.suite = cardSuite;
        this.cardBackColor = cardBack;
    }
}
