import { Cell, ICell } from "../Classes/Cell";
import { Card } from "../Classes/Card";
import { CellMap, ICellMap } from "../Classes/CellMap";
import { IPlayer } from "../Classes/Player";
import { BoardMove } from "../Classes/BoardMove";

export class BoardMoveService {
    static handleCellInteraction(cell: ICell, cellMap: ICellMap, player: IPlayer, moveDetails: BoardMove, isSilent?: boolean) {
        let potentialMoveCells;
        switch (cell.cellType) {
            case Cell.TYPES.BASE:
                potentialMoveCells = BoardMoveService.attemptBaseCellMove(cell, cellMap, moveDetails, isSilent);
                break;
            case Cell.TYPES.HOME:
                  potentialMoveCells = BoardMoveService.attemptHomeCellMove(cell, cellMap, moveDetails, isSilent);
                break;
            default:
                  potentialMoveCells = BoardMoveService.attemptMainCellMove(cell, cellMap, moveDetails, isSilent);
                break;
        }

        return potentialMoveCells;
    }

    static attemptBaseCellMove(cell: ICell, cellMap: ICellMap, moveDetails: BoardMove, isSilent?: boolean) {
        if(cell.playerId === moveDetails.playerId) {
            if (moveDetails.canBeBaseExit()) {
                const nextCell = CellMap.getNextCell(cellMap, cell);
                const potentialMarble = CellMap.getMarbleInMapCell(cellMap, nextCell as ICell);
                if (potentialMarble && potentialMarble.playerId === moveDetails.playerId) {
                    if (!isSilent) {
                        alert('You need to move your marble off of your base exit');
                    }
                } else {
                    return [nextCell];
                }
            } else if (moveDetails.isJoker()) {
                if (!isSilent) {
                    alert('Jokers in progress');
                }
            } else {
                if (!isSilent) {
                    alert('You must exit the base first.');
                }
            }
        } else {
            if (!isSilent) {
                alert('You cannot move marbles from another player\'s base');
            }
        }

        return undefined;
    }

    static attemptMainCellMove(cell: ICell, cellMap: ICellMap, moveDetails: BoardMove, isSilent?: boolean) {
        if (moveDetails.canBeForward() || moveDetails.canBeBackward()) {
            const cellAfterMove = BoardMoveService.getCellAfterStandardMove(cell, cellMap, moveDetails);
            if (cellAfterMove) {
                return [cellAfterMove];
            }
        } else if (moveDetails.isJoker()) {
            if (!isSilent) {
                alert('Jokers in progress');
            }
        } else {
            if (!isSilent) {
                alert('You can only use doubles to exit a marble from your base.');
            }
        }

        return undefined;
    }

    static attemptHomeCellMove(cell: ICell, cellMap: ICellMap, moveDetails: BoardMove, isSilent?: boolean) {
        if (moveDetails.canBeBackward()) {
            if (!isSilent) {
                alert('Once in a home cell, you can only move forward. No 8s or Jokers.');
            }
        } else if (moveDetails.amount > 4 && moveDetails.amount !== 7) {
            if (!isSilent) {
                alert('Move not possible');
            }
        } else {
            const cellAfterMove = BoardMoveService.getCellAfterStandardMove(cell, cellMap, moveDetails);
            if (cellAfterMove) {
                return [cellAfterMove];
            }
        }

        return undefined;
    }

    static getCellAfterStandardMove(cell: ICell, cellMap: ICellMap, moveDetails: BoardMove) {
        if (cell.cellType !== Cell.TYPES.BASE) {
          let currentCell = cell;
          const marble = CellMap.getMarbleInMapCell(cellMap, cell);
          for (let i = 0; i < moveDetails.amount; i++) {
            if (moveDetails.canBeForward()) {
            //   if (currentCell.hasHomeCell() && currentCell.playerId === marble?.playerId) {
            //     currentCell = currentCell.getHomeCell();
            //   } else {
            //     currentCell = currentCell.getNextCell();
            //   }
            } else if (moveDetails.canBeBackward()) {
            //   currentCell = currentCell.getPreviousCell();
            }
    
            if (!currentCell) {
              return undefined;
            } else {
                // Was this okay to remove? Seems to duplicate the previous marble variable.
            //   const marble = currentCell.getMarbleInCell();
              if (marble && marble.playerId === moveDetails.playerId) {
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

    static getPotentialEndCells(startingCell: Cell) {

    }

    static isPlayerStuck(cellMap: ICellMap, player: IPlayer) {
        const canExitBase = BoardMoveService.canExitBaseWithHand(cellMap, player);
        return !canExitBase;
    }

    static canExitBaseWithHand(cellMap: ICellMap, player: IPlayer) {
        const seenCards: number[] = [];
        let canExit = false;
        // TODO: Remove debug comment below when testing no longer
        // const hand = [{id: 13}, {id: 2}, {id: 3} ,{id: 4}, {id: 5}];
        player.hand.forEach(card => {
            const cardType = card.id;
            if (
                cardType === Card.IDS.JACK ||
                cardType === Card.IDS.QUEEN ||
                cardType === Card.IDS.KING ||
                cardType === Card.IDS.ACE
            ) {
                canExit = true;
            } else if (cardType === Card.IDS.JOKER) {
                // const currentCellsOnMainBoard = cellMap.getMarblesOnMainBoard();
                // if (currentCellsOnMainBoard.length) {
                //     currentCellsOnMainBoard.forEach(marble => {
                //         if (marble.playerId !== player.id) {
                //             canExit = true;
                //         }
                //     });
                // }
            } else {
                if (seenCards.indexOf(cardType) >= 0) {
                    canExit = true;
                }
                seenCards.push(cardType);
            }
        });
        return canExit;
    }

    canMoveForwardWithHand() {

    }
}