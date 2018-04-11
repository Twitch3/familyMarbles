import { Injectable } from '@angular/core';
import { GameConstantsService } from './game-constants.service';

@Injectable()
export class BoardStyleService {

  constructor() { }

  // TODO - Remove in favor of dynamic styling
  getFourPlayerStyles(boardPosition: number): any {
    switch (boardPosition) {
      case 1:
        return { transform: 'translate(-' + 8 * 30 + 'px, -' + 9 * 30 + 'px) rotate(90deg)' };
      case 2:
        return { transform: 'translate(0, -' + 18 * 30 + 'px) rotate(180deg)' };
      case 3:
        return { transform: 'translate(' + 8 * 30 + 'px, -' + 9 * 30 + 'px) rotate(270deg)' };
      default:
        return {};
    }
  }

  // TODO - Remove in favor of dynamic styling
  getSixPlayerStyles(boardPosition: number): any {
    switch (boardPosition) {
      case 1:
        return { transform: 'translate(-' + 13 * 30 + 'px, -' + 7.5 * 30 + 'px) rotate(60deg)' };
      case 2:
        return { transform: 'translate(-' + 13 * 30 + 'px, -' + 22.5 * 30 + 'px) rotate(120deg)' };
      case 3:
        return { transform: 'translate(' + 0 + 'px, -' + 30 * 30 + 'px) rotate(180deg)' };
      case 4:
        return { transform: 'translate(' + 13 * 30 + 'px, -' + 22.5 * 30 + 'px) rotate(240deg)' };
      case 5:
        return { transform: 'translate(' + 13 * 30 + 'px, -' + 7.5 * 30 + 'px) rotate(300deg)' };
      default:
        return {};
    }
  }

  // TODO - Fix dynamic styling (includes function below)
  public getBoardSectionStyleObj(boardPosition: number, numberOfPlayers: number): any {
    const boardPieceStyles: any = this.getAllBoardPieceStyles(numberOfPlayers);
    // console.log(boardPieceStyles);
    const rotationalStandard: number = 360 / numberOfPlayers;
    const boardRotation: number = boardPosition * rotationalStandard;
    const xTransform: number = boardPieceStyles[boardPosition].x;
    const yTransform: number = boardPieceStyles[boardPosition].y;
    return { transform: 'rotate(' + boardRotation + 'deg)' };
    // return { transform: 'translate(' + xTransform + 'px) rotate(' + boardRotation + 'deg)' };
  }

  getAllBoardPieceStyles(numberOfPlayers: number): any {
    const boardPieceStyles: any[] = [];
    const rotationalStandard: number = 180 - (360 / numberOfPlayers);
    console.log(rotationalStandard + 'deg');
    let previousPos: any;
    let completeHeight: number = 0;
    let completeWidth: number = 0;
    for (let i = 0; i < numberOfPlayers; i++) {
      if (i === 0) {
        boardPieceStyles.push({
          rotation: i * rotationalStandard,
          x: 0,
          y: 0,
          height: GameConstantsService.SPACE_SIZE,
          width: GameConstantsService.SPACE_SIZE * GameConstantsService.BOARD_SPACE_NUMBER
        });
        previousPos = {
          x: -(GameConstantsService.BOARD_SPACE_NUMBER - 1) * GameConstantsService.SPACE_SIZE,
          y: 0
        };
        completeWidth += GameConstantsService.SPACE_SIZE * GameConstantsService.BOARD_SPACE_NUMBER;
        completeHeight += GameConstantsService.SPACE_SIZE;
      } else {
        const h = GameConstantsService.SPACE_SIZE * GameConstantsService.BOARD_SPACE_NUMBER;
        const y = Math.ceil(Math.abs(Math.sin(180 - rotationalStandard) * h));
        const x = Math.ceil(Math.sqrt((h * h) - (y * y)));
        console.log(x + '/' + y);
        boardPieceStyles.push({
          rotation: i * rotationalStandard,
          x: previousPos.x + x + (15 * i),
          y: previousPos.y + y,
          height: y,
          width: x
        });
        previousPos.x += x;
        previousPos.y += y;
        completeHeight += y;
        completeWidth += x;
      }
    }
    console.log(completeHeight + '/' + completeWidth);
    return boardPieceStyles;
  }

}
