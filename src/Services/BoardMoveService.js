import { Cell } from "../Classes/Cell";

export class BoardMoveService {
    static handleCellClick(cell, cellMap, player, moveDetails) {
        let potentialMoveCells;
        switch (cell.getCellType()) {
            case Cell.TYPES.BASE:
                potentialMoveCells = BoardMoveService.attemptBaseCellMove(cell, moveDetails);
                break;
            case Cell.TYPES.HOME:
                  potentialMoveCells = BoardMoveService.attemptHomeCellMove(cell, moveDetails);
                break;
            default:
                  potentialMoveCells = BoardMoveService.attemptMainCellMove(cell, moveDetails);
                break;
        }

        return potentialMoveCells;
    }

    static attemptBaseCellMove(cell, moveDetails) {
        if(cell.getOwnerId() === moveDetails.playerId) {
            if (moveDetails.canBeBaseExit()) {
                const nextCell = cell.getNextCell();
                const potentialMarble = nextCell.getMarbleInCell();
                if (potentialMarble && potentialMarble.getOwnerId() === moveDetails.playerId) {
                    alert('You need to move your marble off of your base exit');
                } else {
                    return [nextCell];
                }
            } else if (moveDetails.isJoker()) {
                alert('Jokers in progress');
            }else {
                alert('You must exit the base first.');
            }
        } else {
            alert('You cannot move marbles from another player\'s base');
        }

        return undefined;
    }

    static attemptMainCellMove(cell, moveDetails) {
        if (moveDetails.canBeForward() || moveDetails.canBeBackward()) {
            const cellAfterMove = BoardMoveService.getCellAfterStandardMove(cell, moveDetails);
            if (cellAfterMove) {
                return [cellAfterMove];
            }
        } else if (moveDetails.isJoker()) {
            alert('Jokers in progress');
        } else {
            alert('You can only use doubles to exit a marble from your base.');
        }

        return undefined;
    }

    static attemptHomeCellMove(cell, moveDetails) {
        if (moveDetails.canBeBackward()) {
            alert('Once in a home cell, you can only move forward. No 8s or Jokers.');
        } else if (moveDetails.amount > 4 && moveDetails.amount !== 7) {
            alert('Move not possible');
        } else {
            const cellAfterMove = BoardMoveService.getCellAfterStandardMove(cell, moveDetails);
            if (cellAfterMove) {
                return [cellAfterMove];
            }
        }

        return undefined;
    }

    static getCellAfterStandardMove(cell, moveDetails) {
        if (cell.getCellType !== Cell.TYPES.BASE) {
          let currentCell = cell;
          let marble = cell.getMarbleInCell();
          for (let i = 0; i < moveDetails.amount; i++) {
            if (moveDetails.canBeForward()) {
              if (currentCell.hasHomeCell() && currentCell.getOwnerId() === marble.getOwnerId()) {
                currentCell = currentCell.getHomeCell();
              } else {
                currentCell = currentCell.getNextCell();
              }
            } else if (moveDetails.canBeBackward()) {
              currentCell = currentCell.getPreviousCell();
            }
    
            if (!currentCell) {
              return undefined;
            } else {
              const marble = currentCell.getMarbleInCell();
              if (marble && marble.getOwnerId() === moveDetails.playerId) {
                return undefined;
              }
            }
          }
    
          return currentCell;
        }
        return undefined;
      }

    static isMovePossible() {

    }

    static getPotentialEndCells(startingCell, ) {

    }
}