import { Cell } from "./Cell";

export class Marble {
    constructor(playerId, id) {
        this.player = playerId;
        this.id = id;
    }

    getOwnerId() {
        return this.player;
    }
}