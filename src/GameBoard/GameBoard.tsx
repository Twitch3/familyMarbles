import React from "react";
import CSS from "csstype";
import "./GameBoard.css";
import { Card, ICard } from "../Classes/Card";
import { Cell, ICell } from "../Classes/Cell";
import { CellMap } from "../Classes/CellMap";
import { BoardMove } from "../Classes/BoardMove";
import { BoardMoveService } from "../Services/BoardMoveService";
import { IPlayer } from "../Classes/Player";
import { IMarble } from "../Classes/Marble";

interface BoardId {
  player: number;
  cellNumber: number;
  cellType: number;
}

export class GameBoard extends React.Component {
  showHand: boolean;
  player: IPlayer;
  playerId: number;
  selectedCardIndexes: number[];
  selectedMarbleCells: ICell[];
  playerMustDiscard: boolean;
  highlightedCells: string[]; // Array of Cell Ids
  props: any; // TODO - boardgame.io typings
  boardContainer: React.RefObject<any>;
  mainBoard: React.RefObject<any>;
  handContainer: React.RefObject<any>;
  cellSize: number = 20;
  moves: any;

  constructor(gameSetup: any) {
    super(gameSetup);
    this.showHand = false;
    this.playerId = parseInt(gameSetup.playerID, 10);
    const state = gameSetup.G;
    this.moves = gameSetup.moves;
    this.player = state.players[this.playerId];
    this.selectedCardIndexes = [];
    this.selectedMarbleCells = [];
    this.playerMustDiscard = false;
    this.highlightedCells = [];

    this.boardContainer = React.createRef();
    this.mainBoard = React.createRef();
    this.handContainer = React.createRef();
  }

  onCellEnter(id: BoardId) {
    if (this.selectedCardIndexes.length) {
      const key = id.player + "/" + id.cellNumber + "/" + id.cellType;
      const marble = CellMap.getMarbleInMapCellFromKey(
        this.props.G.cellMap,
        key
      );
      if (marble?.playerId === this.playerId) {
        const key = id.player + "/" + id.cellNumber + "/" + id.cellType;
        const cell = CellMap.getMapCell(this.props.G.cellMap, key);
        const moveDetails = new BoardMove(
          this.player,
          this.selectedCardIndexes
        );
        const nextCells = BoardMoveService.handleCellInteraction(
          cell,
          this.props.G.cellMap,
          this.player,
          moveDetails,
          true
        );

        if (nextCells) {
          nextCells.forEach((highlightedCell) => {
            this.highlightedCells.push((highlightedCell as ICell).id);
          });
          this.forceUpdate();
        }
      }
    }
  }

  onCellLeave(id: BoardId) {
    this.highlightedCells = [];
    this.forceUpdate();
  }

  onCellClick(id: BoardId) {
    if (this.selectedCardIndexes.length) {
      const key = id.player + "/" + id.cellNumber + "/" + id.cellType;
      const cell = CellMap.getMapCell(this.props.G.cellMap, key);
      const moveDetails = new BoardMove(this.player, this.selectedCardIndexes);
      const nextCells = BoardMoveService.handleCellInteraction(
        cell,
        this.props.G.cellMap,
        this.player,
        moveDetails
      );
      // TODO: Implement a better return value to be able to handle error messages from the Service
      if (parseInt(this.props.ctx.currentPlayer, 10) === this.playerId) {
        if (nextCells) {
          if (nextCells.length === 1) {
            this.moves.moveMarble(cell, nextCells[0]);
            // CellMap.moveMarbleBetweenCells(this.props.G.cellMap,cell, nextCells[0]);
            // this.props.moves.updateAfterMove(
            //   this.player,
            //   this.selectedCardIndexes
            // );
            // this.player.endTurn(this.selectedCardIndexes, this.props.G.deck);
            // this.updateAfterMove();
          } else {
            console.log(nextCells);
            alert("Moves that require more input are in progress");
          }
        } else {
          alert("That move is not possible");
        }
      } else {
        alert("It is not your turn");
      }
    }
  }

  onHandClick() {
    this.showHand = !this.showHand;
    if (
      this.showHand &&
      BoardMoveService.isPlayerStuck(this.props.G.cellMap, this.player)
    ) {
      this.playerMustDiscard = true;
      alert("You have no valid moves");
    }
    this.forceUpdate();
  }

  // TODO: Solve for pairing face cards iff there's 3 of them since 2 shouldn't work.
  canPairCard(cardIndex: number) {
    if (this.selectedCardIndexes.length === 0) {
      // If no cards are selected
      return true;
    } else if (this.playerMustDiscard) {
      // If you have selected a card, you can only discard one card at a time
      return false;
    } else if (this.selectedCardIndexes.length === 3) {
      // You can only pair a maximum of 3 cards
      return false;
    } else if (this.selectedCardIndexes.indexOf(cardIndex) >= 0) {
      // If the card is already selected- you can unselect it
      return true;
    } else if (
      this.player.hand[cardIndex].id ===
      this.player.hand[this.selectedCardIndexes[0]].id
    ) {
      if (
        this.player.hand[cardIndex].id === Card.IDS.JACK ||
        this.player.hand[cardIndex].id === Card.IDS.QUEEN ||
        this.player.hand[cardIndex].id === Card.IDS.KING ||
        this.player.hand[cardIndex].id === Card.IDS.ACE
      ) {
        const matchingCardIds = this.player.hand.filter((card) => {
          return card.id === this.player.hand[cardIndex].id;
        });
        return matchingCardIds ? matchingCardIds.length === 3 : false;
      }
      // If the card matches an ID of an already selected and it isn't a JOKER
      return this.player.hand[cardIndex].id !== Card.IDS.JOKER;
    }
    return false;
  }

  onSelectCard(cardIndex: number) {
    const indexOfSelectedCard = this.selectedCardIndexes.indexOf(cardIndex);

    if (this.canPairCard(cardIndex)) {
      if (indexOfSelectedCard === -1) {
        this.selectedCardIndexes.push(cardIndex);
      } else {
        this.selectedCardIndexes.splice(indexOfSelectedCard, 1);
      }
    } else {
      this.selectedCardIndexes = [cardIndex];
    }
    this.forceUpdate();
  }

  updateAfterMove() {
    this.selectedCardIndexes = [];
    this.highlightedCells = [];
    this.playerMustDiscard = false;
  }

  updateDimensions() {
    const mainHeight = this.mainBoard.current.offsetHeight + this.cellSize * 2;
    const mainWidth = this.mainBoard.current.offsetWidth + this.cellSize * 2;
    const containerHeight = window.innerHeight;
    const containerWidth = window.innerWidth;
    const heightRatio = containerHeight / mainHeight;
    const widthRatio = containerWidth / mainWidth;

    const ratio = heightRatio < widthRatio ? heightRatio : widthRatio;

    this.boardContainer.current.style.transform = "scale(" + ratio + ")";
    this.boardContainer.current.style.transformOrigin = "0 0";
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  renderMainCellSection(
    playerId: number,
    cellNumber: number,
    cellSize: number,
    cellMargin: number,
    playerColors: string[]
  ): JSX.Element {
    const id: BoardId = {
      player: playerId,
      cellNumber: cellNumber,
      cellType: Cell.TYPES.MAIN,
    };
    const mainKey: string = playerId + "/" + cellNumber + "/" + Cell.TYPES.MAIN;
    const mainCellMarble: IMarble | undefined =
      CellMap.getMarbleInMapCellFromKey(this.props.G.cellMap, mainKey);
    const mainCellIsHightlighted: number =
      this.highlightedCells.indexOf(mainKey); // TODO: Is this a good enough check?
    const mainCellStyle: CSS.Properties = {
      width: cellSize + "px",
      height: cellSize + "px",
      borderColor: mainCellMarble ? "black" : playerColors[playerId],
      marginLeft: cellMargin + "px",
      background: mainCellMarble ? playerColors[mainCellMarble.playerId] : "",
    };
    const highlightStyle: CSS.Properties = {
      display: mainCellIsHightlighted ? "none" : "block",
    };

    return (
      <div
        className="board-cell"
        style={mainCellStyle}
        key={JSON.stringify(id)}
        onClick={() => this.onCellClick(id)}
        onMouseEnter={() => this.onCellEnter(id)}
        onMouseLeave={() => this.onCellLeave(id)}
      >
        <div className="cell-highlight" style={highlightStyle}></div>
      </div>
    );
  }

  renderBaseCellSection(
    playerId: number,
    cellNumber: number,
    cellSize: number,
    cellMargin: number,
    playerColors: string[]
  ): JSX.Element {
    const completeCellSize: number = cellSize + cellMargin;
    const baseId: BoardId = {
      player: playerId,
      cellNumber: cellNumber,
      cellType: Cell.TYPES.BASE,
    };
    let baseTranslateX: number = 8;
    if (cellNumber === 3) {
      baseTranslateX = 9;
    } else if (cellNumber === 4) {
      baseTranslateX = 7;
    }
    let baseTranslateY: number = 2;
    if (cellNumber === 1) {
      baseTranslateY = 1;
    } else if (cellNumber === 2) {
      baseTranslateY = 3;
    }
    const baseKey: string = playerId + "/" + cellNumber + "/" + Cell.TYPES.BASE;
    const baseCellMarble: IMarble | undefined =
      CellMap.getMarbleInMapCellFromKey(this.props.G.cellMap, baseKey);
    const baseCellStyle: CSS.Properties = {
      position: "absolute",
      borderColor: baseCellMarble ? "black" : playerColors[playerId],
      width: cellSize + "px",
      height: cellSize + "px",
      marginLeft: cellMargin + "px",
      backgroundColor: baseCellMarble ? playerColors[playerId] : "",
      transform:
        "translate(" +
        baseTranslateX * completeCellSize +
        "px, -" +
        baseTranslateY * completeCellSize +
        "px)",
    };
    return (
      <div
        className="board-cell"
        style={baseCellStyle}
        key={JSON.stringify(baseId)}
        onClick={() => this.onCellClick(baseId)}
        onMouseEnter={() => this.onCellEnter(baseId)}
        onMouseLeave={() => this.onCellLeave(baseId)}
      ></div>
    );
  }

  renderHomeCellSection(
    playerId: number,
    cellNumber: number,
    cellSize: number,
    cellMargin: number,
    playerColors: string[]
  ): JSX.Element {
    const completeCellSize: number = cellSize + cellMargin;
    const homeId: BoardId = {
      player: playerId,
      cellNumber: cellNumber,
      cellType: Cell.TYPES.HOME,
    };
    const homeTranslateX: number = cellNumber > 2 ? cellNumber + 1 : 3;
    const homeTranslateY: number = cellNumber < 2 ? cellNumber + 1 : 3;
    const homeKey: string = playerId + "/" + cellNumber + "/" + Cell.TYPES.HOME;
    const homeCellMarble: IMarble | undefined =
      CellMap.getMarbleInMapCellFromKey(this.props.G.cellMap, homeKey);
    const homeCellIsHightlighted: number =
      this.highlightedCells.indexOf(homeKey); // TODO: Is this a good enough check?
    const homeCellStyle: CSS.Properties = {
      position: "absolute",
      borderColor: homeCellMarble ? "black" : playerColors[playerId],
      width: cellSize + "px",
      height: cellSize + "px",
      marginLeft: cellMargin + "px",
      backgroundColor: homeCellMarble ? playerColors[playerId] : "",
      transform:
        "translate(" +
        homeTranslateX * completeCellSize +
        "px, -" +
        homeTranslateY * completeCellSize +
        "px)",
    };
    const highlightStyle: CSS.Properties = {
      display: homeCellIsHightlighted ? "none" : "block",
    };
    return (
      <div
        className="board-cell"
        style={homeCellStyle}
        key={JSON.stringify(homeId)}
        onClick={() => this.onCellClick(homeId)}
        onMouseEnter={() => this.onCellEnter(homeId)}
        onMouseLeave={() => this.onCellLeave(homeId)}
      >
        <div className="cell-highlight" style={highlightStyle}></div>
      </div>
    );
  }

  renderBoardSlabs(
    numPlayers: number,
    cellSize: number,
    cellMargin: number,
    slabWidth: number,
    playerColors: string[]
  ): JSX.Element[] {
    let boardSlabs: JSX.Element[] = [];

    // Create a board slab for each player in the game
    for (let i = 0; i < numPlayers; i++) {
      const mainCells: JSX.Element[] = [];
      const baseCells: JSX.Element[] = [];
      const homeCells: JSX.Element[] = [];

      // Create the main section of cells on the slab
      for (let j = 0; j < 18; j++) {
        mainCells.push(
          this.renderMainCellSection(i, j, cellSize, cellMargin, playerColors)
        );
      }

      // Create the base and home section of cells on the slab
      for (let k = 0; k < 5; k++) {
        baseCells.push(
          this.renderBaseCellSection(i, k, cellSize, cellMargin, playerColors)
        );
        homeCells.push(
          this.renderHomeCellSection(i, k, cellSize, cellMargin, playerColors)
        );
      }

      const slabStyles: CSS.Properties = {
        width: slabWidth + "px",
      };

      boardSlabs.push(
        <div className="board-slab" style={slabStyles} key={i}>
          <div className="base-cells">{baseCells}</div>
          <div className="home-cells">{homeCells}</div>
          <div className="main-cells">{mainCells}</div>
        </div>
      );
    }

    return boardSlabs;
  }

  // Helper function to recursively connect each slab with the slabs that come after it in a group.
  connectPlayerSlabs(
    slabs: JSX.Element[],
    index: number,
    slabWidth: number,
    boardCircleDiameter: number,
    cellSize: number,
    cellMargin: number,
    boardInRadius: number,
    rotationalAngle: number
  ): JSX.Element | null {
    const styles: CSS.Properties = {
      width: slabWidth + "px",
      top: "",
      transform: "",
      left: "",
      transformOrigin: "",
    };
    if (index === 0) {
      const centerCirumcircleX: number = boardCircleDiameter / 2;
      const centerCirumcircleY: number = centerCirumcircleX;
      const centerPolygonX: number = cellSize / 2 + cellMargin + slabWidth / 2;
      const centerPolygonY: number = cellSize / 2 + boardInRadius;

      styles.top = boardCircleDiameter - cellSize + "px";
      styles.transform =
        "translate(" +
        (centerCirumcircleX - centerPolygonX) +
        "px, -" +
        (centerCirumcircleY - centerPolygonY) +
        "px)";
    } else {
      styles.left = 18 * (cellSize + cellMargin) + "px";
      styles.transformOrigin =
        cellSize / 2 + cellMargin + "px " + cellSize / 2 + "px";
      styles.transform = "rotate(-" + rotationalAngle + "deg)";
    }
    if (index === slabs.length) {
      return null;
    }
    return (
      <div className="slab-container" style={styles}>
        {slabs[index]}
        {this.connectPlayerSlabs(
          slabs,
          index + 1,
          slabWidth,
          boardCircleDiameter,
          cellSize,
          cellMargin,
          boardInRadius,
          rotationalAngle
        )}
      </div>
    );
  }

  render() {
    // START BOARD SIZE SETUP
    const numPlayers = this.props.G.numPlayers;

    const cellSize = 20;
    this.cellSize = cellSize; // TODO: Do we need this as a board prop and should this be an input from settings?
    const cellMargin = 5;
    const slabWidth = (cellSize + cellMargin) * 18;

    const boardInRadius = slabWidth / (2 * Math.tan(Math.PI / numPlayers));
    const boardCircumRadius = slabWidth / (2 * Math.sin(Math.PI / numPlayers));

    const boardCircleDiameter = boardCircumRadius * 2;

    const playerColors = ["red", "blue", "green", "orange"];

    const players: IPlayer[] = this.props.G.players;
    // END BOARD SIZE SETUP

    const boardSlabs: JSX.Element[] = this.renderBoardSlabs(
      numPlayers,
      cellSize,
      cellMargin,
      slabWidth,
      playerColors
    );

    // Calculate angle between board slabs based on number of players
    const rotationalAngle = 180 - ((numPlayers - 2) * 180) / numPlayers;

    const slabContainers: JSX.Element = this.connectPlayerSlabs(
      boardSlabs,
      0,
      slabWidth,
      boardCircleDiameter,
      cellSize,
      cellMargin,
      boardInRadius,
      rotationalAngle
    ) as JSX.Element;

    // START CARD HAND SETUP
    const cardContainerStyles: CSS.Properties = {
      transform:
        "translate(" +
        ((boardCircleDiameter - 150) / 2 + cellSize) +
        "px, " +
        ((boardCircleDiameter - 96) / 2 + cellSize) +
        "px)",
    };

    const hand: ICard[] = players[this.playerId].hand;
    const handCards: JSX.Element[] = [];
    const mainHandCards: JSX.Element[] = [];

    for (let c = 0; c < hand.length; c++) {
      const handCardStyle: CSS.Properties = Card.getSpriteCoordinates(hand[c]);
      handCardStyle.height = 96 + "px";
      handCardStyle.width = 71 + "px";
      handCardStyle.position = "absolute";
      handCardStyle.transformOrigin = "0 96px";
      handCardStyle.transform = "rotate(" + 10 * c + "deg)";
      handCardStyle.border = undefined;
      handCards.push(
        <div className="hand-card" key={c} style={handCardStyle}></div>
      );

      const mainHandCardStyle = Object.assign({}, handCardStyle);

      if (this.selectedCardIndexes.indexOf(c) >= 0) {
        mainHandCardStyle.transform =
          "translate(" + 25 * c + "px, -20px) rotate(" + 10 * c + "deg)";
        handCardStyle.transform =
          "translate(" + 5 * c + "px, -20px) rotate(" + 10 * c + "deg)";
      } else {
        mainHandCardStyle.transform =
          "translateX(" + 20 * c + "px) rotate(" + 10 * c + "deg)";
        mainHandCardStyle.marginLeft = "5px";
      }

      if (
        this.canPairCard(c) &&
        this.selectedCardIndexes.length &&
        this.selectedCardIndexes.indexOf(c) === -1
      ) {
        mainHandCardStyle.border = "2px solid cornflowerblue";
      }

      mainHandCards.push(
        <div
          className="hand-card"
          key={c + 5}
          style={mainHandCardStyle}
          onClick={this.onSelectCard.bind(this, c)}
        ></div>
      );
    }

    const handContainerStyles: CSS.Properties = {
      position: "absolute",
      transform: "translateY(-96px)",
    };

    const mainHandContainerStyles: CSS.Properties = {
      position: "absolute",
      transformOrigin: "0 96px",
      transform: "rotate(-20deg) scale(1.3) translate(-15px, 20px)",
      display: this.showHand ? "block" : "none",
    };
    // END CARD HAND SETUP

    // Styles to contextualize each player's perspective
    const mainBoardStyles: CSS.Properties = {
      width: boardCircleDiameter + "px",
      height: boardCircleDiameter + "px",
      transform:
        "translate(" +
        cellSize +
        "px, " +
        cellSize +
        "px) rotate(" +
        this.playerId * rotationalAngle +
        "deg)",
    };

    // Change text color to match current player's turn
    const turnTrackerStyles: CSS.Properties = {
      color: playerColors[this.props.ctx.currentPlayer],
    };

    return (
      <div id="game-container">
        <div ref={this.boardContainer} id="board-container">
          <div id="turn-tracker" style={turnTrackerStyles}>
            It's Player {parseInt(this.props.ctx.currentPlayer, 10) + 1}'s Turn
          </div>
          {/* <div id="context-messages">Contextual Messages Go Here</div> */}
          <div id="card-container" style={cardContainerStyles}>
            <div id="main-hand-container" style={mainHandContainerStyles}>
              {mainHandCards}
            </div>
            <div
              id="draw-pile"
              style={
                this.props.G.nextDrawableCard
                  ? Card.getCardBackCoordinates(this.props.G.nextDrawableCard)
                  : {}
              }
            ></div>
            <div
              id="discard-pile"
              style={
                this.props.G.lastPlayedCard
                  ? this.props.G.lastPlayedCard.getSpriteCoordinates()
                  : {}
              }
            ></div>
          </div>
          <div ref={this.mainBoard} id="main-board" style={mainBoardStyles}>
            {slabContainers}
          </div>
          <div
            id="hand-container"
            ref={this.handContainer}
            onClick={this.onHandClick.bind(this)}
            style={handContainerStyles}
          >
            {handCards}
          </div>
        </div>
      </div>
    );
  }
}
