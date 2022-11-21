export interface IMarble {
  playerId: number;
  id: number;
}
export class Marble implements IMarble {
  playerId: number;
  id: number;

  constructor(playerId: number, id: number) {
    this.playerId = playerId;
    this.id = id;
  }

  static buildMarble(playerId: number, id: number): IMarble {
    return {
        playerId: playerId,
        id: id
    };
  }

  getOwnerId() {
    return this.playerId;
  }

  toSerializable(): IMarble {
    return {
      playerId: this.playerId,
      id: this.id,
    };
  }
}
