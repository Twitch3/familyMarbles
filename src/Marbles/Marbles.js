import { Game } from 'boardgame.io/core';
import { Deck } from '../Classes/Deck';
import { CellMap } from '../Classes/CellMap';
import { Player } from '../Classes/Player';

function isVictory(cells) {
    return false;
}

const Marbles = Game({
    setup: (settings) => {
        const newDeck = new Deck();
        const newNextDrawableCard = newDeck.getNextDrawableCard();
        const players = [];
        const cellMap = new CellMap(settings.numPlayers);
        for (let i = 0; i < settings.numPlayers; i++) {
            players.push(new Player(i, newDeck, cellMap));
        }
        return ({
            deck: newDeck,
            lastPlayedCard: undefined,
            nextDrawableCard: newNextDrawableCard,
            numPlayers: settings.numPlayers,
            players: players,
            cellMap: cellMap
        });
    },

    moves: {    
        updateAfterMove(G, ctx) {
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