export class Cell {
    constructor(playerId, index, cellType) {
        this.playerId = playerId;
        this.cellIndex = index;
        this.cellType = cellType;
    }

    setNextCell(nextCell) {
        this.nextCell = nextCell;
    }

    setPreviousCell(prevCell) {
        this.prevCell = prevCell;
    }

    setHomeCell(homeCell) {
        this.hasHomeCell = true;
        this.homeCell = homeCell;
    }

    getCellId() {
        return this.playerId + '/' + this.cellIndex +'/' + this.cellType;
    }

    getMarbleInCell() {
        return this.marble;
    }

    setMarbleInCell(marble) {
        this.marble = marble;
    }
}