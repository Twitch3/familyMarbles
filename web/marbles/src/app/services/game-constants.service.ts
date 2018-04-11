import { Injectable } from '@angular/core';

@Injectable()
export class GameConstantsService {

  public static SPACE_SIZE: number = 30;
  public static BOARD_SPACE_NUMBER: number = 17;
  public static BOARD_SPACE_NUMBER_LEFT_HALF: number = 9;
  public static BOARD_SPACE_NUMBER_RIGHT_HALF: number = 7;
  public static BOARD_SIZE: number = 30 * 17;

  constructor() { }

}
