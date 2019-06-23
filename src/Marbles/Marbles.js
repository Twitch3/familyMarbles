import { Game } from 'boardgame.io/core';
import { Deck } from '../Classes/Deck';

function isVictory(cells) {
    return false;
}

const Marbles = Game({
    setup: (settings) => {
        const newDeck = new Deck();
        const newNextDrawableCard = newDeck.getNextDrawableCard();
        const players = [];
        // TODO: Set up players with their own marbles with location based on cell IDs.
        for (let i = 0; i < settings.numPlayers; i++) {
            const hand = [];
            for (let j = 0; j < 5; j++) {
                hand.push(newDeck.draw());
            }
            players.push({
                id: i,
                hand: hand
            });
        }
        return ({
            deck: newDeck,
            lastPlayedCard: undefined,
            nextDrawableCard: newNextDrawableCard,
            numPlayers: settings.numPlayers,
            players: players
        });
    },

    moves: {    
        moveMarble(G, ctx, move) {
            this.lastPlayedCard = this.deck.draw();
            this.nextDrawableCard = this.deck.getNextDrawableCard();
            ctx.events.endTurn();
        },
    },

    flow: {
        endGameIf: (G, ctx) => {
            if (isVictory(G.cells)) {
                return { winner: ctx.currentPlayer };
            }
        },
    },
});



export default Marbles;