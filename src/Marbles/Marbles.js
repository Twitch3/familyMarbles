import { Game } from 'boardgame.io/core';
import { Deck } from '../Classes/Deck';
import { Marble } from '../Classes/Marble';
import { GameBoard } from '../GameBoard/GameBoard';
import { CellMap } from '../Classes/CellMap';

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
            const hand = [];
            const marbles = [];
            for (let j = 0; j < 5; j++) {
                hand.push(newDeck.draw());
                const marble = new Marble(i, j);
                const baseCell = cellMap.getCell(i, j, GameBoard.CELL_TYPES.BASE);
                baseCell.setMarbleInCell(marble);
                marbles.push(marble);
            }
            players.push({
                id: i,
                hand: hand,
                marbles: marbles
            });
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
            // TODO: Handle ending a turn here. The player has just made a valid move.
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