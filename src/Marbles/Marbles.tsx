import { Ctx, FnContext, Game } from "boardgame.io";
import { Deck, IDeck } from "../Classes/Deck";
import { CellMap, ICellMap } from "../Classes/CellMap";
import { IPlayer, Player } from "../Classes/Player";
import { Card, ICard } from "../Classes/Card";
import { ICell } from "../Classes/Cell";

function isVictory(cells: ICellMap) {
  return false;
}

interface MarblesState {
  cellMap: ICellMap;
  deck: IDeck;
  numPlayers: number;
  lastPlayedCard?: ICard;
  nextDrawableCard: ICard;
  players: IPlayer[];
  test: any[]
}

const Marbles: Game<MarblesState> = {
  name: "Jokers-and-Marbles",
  setup: (context: { ctx: Ctx }) => {
    const newDeck: Deck = new Deck();
    const newNextDrawableCard: Card = newDeck.getNextDrawableCard();
    const players: IPlayer[] = [];
    const cellMap: ICellMap = CellMap.buildCellMap(context.ctx.numPlayers);
    for (let i = 0; i < context.ctx.numPlayers; i++) {
      players.push(new Player(i, newDeck, cellMap).toSerializable());
    }
    return {
      deck: newDeck.toSerializable(),
      lastPlayedCard: undefined,
      nextDrawableCard: newNextDrawableCard.toSerializable(),
      numPlayers: context.ctx.numPlayers,
      cellMap: cellMap,
      players: players,
      test: [0,0,0,0]
    };
  },

  moves: {
    updateAfterMove({G, ctx}) {
      console.log(ctx);
    },
    moveMarble({G, ctx}, initialCell: ICell, targetCell: ICell) {
      console.log(G.cellMap);
      CellMap.moveMarbleBetweenCells(G.cellMap, initialCell, targetCell);
    }
  },

  endIf: (context: FnContext): any => {
    // TODO: Add interface as we expand this functionality.
    if (isVictory(context.G.cellMap)) {
      return { winner: context.ctx.currentPlayer };
    }
  },
};

export default Marbles;
