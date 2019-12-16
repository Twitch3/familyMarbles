export class Cell {
    static TYPES = {
        MAIN: 0,
        BASE: 1,
        HOME: 2
      }
    constructor(playerId, index, cellType) {
        this.playerId = playerId;
        this.cellIndex = index;
        this.cellType = cellType;
    }

    setNextCell(nextCell) {
        this.nextCell = nextCell;
    }

    getNextCell(nextCell) {
        return this.nextCell;
    }

    setPreviousCell(prevCell) {
        this.prevCell = prevCell;
    }

    getPreviousCell(prevCell) {
       return this.prevCell;
    }

    setHomeCell(homeCell) {
        this.homeCell = homeCell;
    }

    getHomeCell(homeCell) {
        return this.homeCell;
    }

    hasHomeCell() {
        return this.homeCell !== undefined;
    }

    getOwnerId() {
        return this.playerId;
    }

    getCellType() {
        return this.cellType;
    }

    getCellIndex() {
        return this.cellIndex;
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

    moveMarbleToCell(newCell, cellMap) {
        const potentialMarble = newCell.getMarbleInCell();
        if (potentialMarble) {
            // TODO: Handle landing on an ally
            const playerId = potentialMarble.getOwnerId();
            for (let i = 0; i < 5; i++) {
                const cell = cellMap.getCell(playerId, i, Cell.TYPES.BASE);
                if (!cell.getMarbleInCell()) {
                    newCell.moveMarbleToCell(cell, cellMap);
                    break;
                }
            }
        }
        newCell.setMarbleInCell(this.marble);
        this.marble = undefined;
    }
}