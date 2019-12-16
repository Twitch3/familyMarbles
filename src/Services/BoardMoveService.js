import { Cell } from "../Classes/Cell";
import { Card } from "../Classes/Card";

export class BoardMoveService {
    static handleCellInteraction(cell, cellMap, player, moveDetails, isSilent) {
        let potentialMoveCells;
        switch (cell.getCellType()) {
            case Cell.TYPES.BASE:
                potentialMoveCells = BoardMoveService.attemptBaseCellMove(cell, moveDetails, isSilent);
                break;
            case Cell.TYPES.HOME:
                  potentialMoveCells = BoardMoveService.attemptHomeCellMove(cell, moveDetails, isSilent);
                break;
            default:
                  potentialMoveCells = BoardMoveService.attemptMainCellMove(cell, moveDetails, isSilent);
                break;
        }

        return potentialMoveCells;
    }

    static attemptBaseCellMove(cell, moveDetails, isSilent) {
        if(cell.getOwnerId() === moveDetails.playerId) {
            if (moveDetails.canBeBaseExit()) {
                const nextCell = cell.getNextCell();
                const potentialMarble = nextCell.getMarbleInCell();
                if (potentialMarble && potentialMarble.getOwnerId() === moveDetails.playerId) {
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

    static attemptMainCellMove(cell, moveDetails, isSilent) {
        if (moveDetails.canBeForward() || moveDetails.canBeBackward()) {
            const cellAfterMove = BoardMoveService.getCellAfterStandardMove(cell, moveDetails);
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

    static attemptHomeCellMove(cell, moveDetails, isSilent) {
        if (moveDetails.canBeBackward()) {
            if (!isSilent) {
                alert('Once in a home cell, you can only move forward. No 8s or Jokers.');
            }
        } else if (moveDetails.amount > 4 && moveDetails.amount !== 7) {
            if (!isSilent) {
                alert('Move not possible');
            }
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

    static isPlayerStuck(cellMap, player) {
        const canExitBase = BoardMoveService.canExitBaseWithHand(cellMap, player);
        return !canExitBase;
    }

    static canExitBaseWithHand(cellMap, player) {
        const seenCards = [];
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
                const currentCellsOnMainBoard = cellMap.getMarblesOnMainBoard();
                if (currentCellsOnMainBoard.length) {
                    currentCellsOnMainBoard.forEach(marble => {
                        if (marble.player !== player.id) {
                            canExit = true;
                        }
                    });
                }
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