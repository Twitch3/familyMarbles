import { Marble } from './Marble';
import { Cell } from './Cell';

export class Player {
    constructor(playerId, deck, cellMap) {
        this.id = playerId;
        this.color = '#000';

        const hand = [];
        const marbles = [];
        for (let j = 0; j < 5; j++) {
            hand.push(deck.draw());
            const marble = new Marble(playerId, j);
            const baseCell = cellMap.getCell(playerId, j, Cell.TYPES.BASE);
            baseCell.setMarbleInCell(marble);
            marbles.push(marble);
        }

        this.hand = hand;
        this.marbles = marbles;
    }
}