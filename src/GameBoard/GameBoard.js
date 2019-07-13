import React from 'react';
import './GameBoard.css';
import { Card } from '../Classes/Card';

export class GameBoard extends React.Component {

  constructor(gameSetup) {
    super(gameSetup);
    this.showHand = false;
    this.playerId = gameSetup.playerID;
    const state = this.props.G;
    this.player = state.players[this.playerId];
    this.selectedCardIndexes = [];
  }

  static CELL_TYPES = {
    MAIN: 0,
    BASE: 1,
    HOME: 2
  }

  commitToMove(id) {
    this.props.moves.moveMarble(id);
  }

  onCellEnter(id) {
    // TODO: Create temp preview of possible move when hovering
    if (this.selectedCardIndexes.length) {
      const key = id.player + '/' + id.cellNumber + '/' + id.cellType;
      const marble = this.props.G.cellMap[key].getMarbleInCell();
      if (marble) {
        // Set temporary preview here
      }
    }
  }

  onCellLeave(id) {
    // TODO: Create temp preview of possible move when hovering (In this case, removal of such)
  }

  getMoveDetails() {
    const numCards = this.selectedCardIndexes.length;
    if (numCards > 0) {
      const card = this.player.hand[this.selectedCardIndexes[0]];
      const cardType = card.id;
      if (this.selectedCardIndexes.length === 2) {
        return {
          amount: 1,
          type: 'exitBase'
        }
      } else {
        if (cardType === Card.IDS.JOKER) {
          return {
            amount: 1,
            type: 'joker'
          }
          // TODO: Code case for 7
        } else {
          return {
            amount: card.amount * numCards,
            type: cardType === Card.IDS.EIGHT ? 'backward' : 'forward'
          }
        }
      }
    } else {
      return {
        amount: 0,
        type: 'forward'
      }
    }
  }

  onCellClick(id) {
    // this.props.events.endTurn();
    if (this.selectedCardIndexes.length) {
      const key = id.player + '/' + id.cellNumber + '/' + id.cellType;
      const marble = this.props.G.cellMap[key].getMarbleInCell();
      if (marble && marble.getOwnerId() === this.player.id) {
        console.log(this.getMoveDetails());
      }
    }
  }

  onHandClick() {
    this.showHand = !this.showHand;
    this.forceUpdate();
  }

  isPlayableMove() {
    // TODO: Instead of returning a boolean- return the type of move (single, double, triple, or invalid)
  }

  canPairCard(cardIndex) {
    if (this.selectedCardIndexes.length === 0) {
      // If no cards are selected
      return true;
    } else if (this.selectedCardIndexes.length === 3) {
      // You can only pair a maximum of 3 cards
      return false;
    } else if (this.selectedCardIndexes.indexOf(cardIndex) >= 0) {
      // If the card is already selected- you can unselect it
      return true;
    } else if (this.player.hand[cardIndex].id === this.player.hand[this.selectedCardIndexes[0]].id) {
      // If the card matches an ID of an already selected and it isn't a JOKER
      return this.player.hand[cardIndex].id !== Card.IDS.JOKER;
    }
    return false;
  }

  onSelectCard(cardIndex) {
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

  updateDimensions() {
    const mainHeight = this.refs.mainBoard.offsetHeight + (this.cellSize * 2);
    const mainWidth = this.refs.mainBoard.offsetWidth + (this.cellSize * 2);
    const containerHeight = document.body.clientHeight;
    const containerWidth = document.body.clientWidth;
    const heightRatio = containerHeight / mainHeight;
    const widthRatio = containerWidth / mainWidth;
    const ratio = heightRatio < widthRatio ? heightRatio : widthRatio;

    this.refs.boardContainer.style.transform = 'scale(' + ratio + ')';
    this.refs.boardContainer.style.transformOrigin = '0 0';
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    let numPlayers = this.props.G.numPlayers;

    const cellSize = 20;
    this.cellSize = cellSize;
    const cellMargin = 5;
    const slabWidth = ((cellSize + cellMargin) * 18);

    const boardInRadius = slabWidth / (2 * Math.tan(Math.PI / numPlayers));
    const boardCircumRadius = slabWidth / (2 * Math.sin(Math.PI / numPlayers));

    let boardCircleDiameter = boardCircumRadius * 2;

    const playerColors = [
      'red',
      'blue',
      'green',
      'orange'
    ];


    let boardSlabs = [];

    for (let i = 0; i < numPlayers; i++) {
      let mainCells = [];
      let baseCells = [];
      let homeCells = [];
      for (let j = 0; j < 18; j++) {
        const id = {
          player: i,
          cellNumber: j,
          cellType: GameBoard.CELL_TYPES.MAIN
        };
        const mainKey = i + '/' + j + '/' + GameBoard.CELL_TYPES.MAIN;
        const mainCellMarble = this.props.G.cellMap[mainKey].getMarbleInCell();
        const mainCellStyle = {
          width: cellSize + 'px',
          height: cellSize + 'px',
          borderColor: mainCellMarble ? 'black' : playerColors[i],
          marginLeft: cellMargin + 'px',
          background: mainCellMarble ? playerColors[i] : ''
        };
        mainCells.push(
          <div className='board-cell' style={mainCellStyle} key={JSON.stringify(id)} onClick={() => this.onCellClick(id)}>
          </div>
        );
      }
      for (let k = 0; k < 5; k++) {
        const completeCellSize = cellSize + cellMargin;

        const baseId = {
          player: i,
          cellNumber: k,
          cellType: GameBoard.CELL_TYPES.BASE
        };
        let baseTranslateX = 8;
        if (k === 3) {
          baseTranslateX = 9;
        } else if (k === 4) {
          baseTranslateX = 7;
        }
        let baseTranslateY = 2;
        if (k === 1) {
          baseTranslateY = 1;
        } else if (k === 2) {
          baseTranslateY = 3;
        }
        const baseKey = i + '/' + k + '/' + GameBoard.CELL_TYPES.BASE;
        const baseCellMarble = this.props.G.cellMap[baseKey].getMarbleInCell();
        const baseCellStyle = {
          position: 'absolute',
          borderColor: baseCellMarble ? 'black' : playerColors[i],
          width: cellSize + 'px',
          height: cellSize + 'px',
          marginLeft: cellMargin + 'px',
          backgroundColor: baseCellMarble ? playerColors[i] : '',
          transform: 'translate(' + baseTranslateX * completeCellSize + 'px, -' + baseTranslateY * completeCellSize + 'px)'
        };
        baseCells.push(
          <div className='board-cell' style={baseCellStyle} key={JSON.stringify(baseId)} onClick={() => this.onCellClick(baseId)}>
          </div>
        );

        const homeId = {
          player: i,
          cellNumber: k,
          cellType: GameBoard.CELL_TYPES.HOME
        };
        const homeTranslateX = k > 2 ? (k + 1) : 3;
        const homeTranslateY = k < 2 ? (k + 1) : 3;
        const homeKey = i + '/' + k + '/' + GameBoard.CELL_TYPES.HOME; 
        const homeCellMarble = this.props.G.cellMap[homeKey].getMarbleInCell();
        const homeCellStyle = {
          position: 'absolute',
          borderColor: homeCellMarble ? 'black' : playerColors[i],
          width: cellSize + 'px',
          height: cellSize + 'px',
          marginLeft: cellMargin + 'px',
          backgroundColor: homeCellMarble ? playerColors[i] : '',
          transform: 'translate(' + homeTranslateX * completeCellSize + 'px, -' + homeTranslateY * completeCellSize + 'px)'
        };
        homeCells.push(
          <div className='board-cell' style={homeCellStyle} key={JSON.stringify(homeId)} onClick={() => this.onCellClick(homeId)}>
          </div>
        );
      }

      const slabStyles = {
        width: slabWidth + 'px'
      }

      boardSlabs.push(<div className='board-slab' style={slabStyles} key={i}>
        <div className="base-cells">{baseCells}</div>
        <div className="home-cells">{homeCells}</div>
        <div className="main-cells">{mainCells}</div>
      </div>);
    }

    const rotationalAngle = 180 - (((numPlayers - 2) * 180) / numPlayers);

    // Helper function to recursively connect each slab with the slabs that come after it in a group.
    function connectSlabs(slabs, index) {
      const styles = {
        width: slabWidth
      };
      if (index === 0) {
        const centerCirumcircleX = boardCircleDiameter / 2;
        const centerCirumcircleY = centerCirumcircleX;
        const centerPolygonX = (cellSize / 2) + cellMargin + (slabWidth / 2);
        const centerPolygonY = (cellSize / 2) + boardInRadius;

        styles.top = boardCircleDiameter - cellSize + 'px';
        styles.transform = 'translate(' + (centerCirumcircleX - centerPolygonX) + 'px, -' + (centerCirumcircleY - centerPolygonY) + 'px)';
      } else {
        styles.left = 18 * (cellSize + cellMargin) + 'px';
        styles.transformOrigin = (cellSize / 2 + cellMargin) + 'px ' + (cellSize / 2) + 'px';
        styles.transform = 'rotate(-' + rotationalAngle + 'deg)';
      }
      if (index === slabs.length) {
        return null;
      }
      return <div className='slab-container' style={styles}>{slabs[index]}{connectSlabs(slabs, index + 1)}</div>;
    };

    const slabContainers = connectSlabs(boardSlabs, 0);

    const mainBoardStyles = {
      width: boardCircleDiameter + 'px',
      height: boardCircleDiameter + 'px',
      transform: 'translate(' + cellSize + 'px, ' + cellSize + 'px) rotate(' + (this.playerId * rotationalAngle) + 'deg)',
    };

    const cardContainerStyles = {
      transform: 'translate(' + ((boardCircleDiameter - 150) / 2 + cellSize) + 'px, ' + ((boardCircleDiameter - 96) / 2 + cellSize) + 'px)'
    }

    const hand = this.player.hand;
    const handCards = [];
    const mainHandCards = [];

    for (let c = 0; c < hand.length; c++) {
      const handCardStyle = hand[c].getSpriteCoordinates();
      handCardStyle.height = 96 + 'px';
      handCardStyle.width = 71 + 'px';
      handCardStyle.position = 'absolute';
      handCardStyle.transformOrigin = '0 96px';
      handCardStyle.transform = 'rotate(' + (10 * c) + 'deg)';
      handCardStyle.border = undefined;
      handCards.push(<div className="hand-card" key={c} style={handCardStyle}></div>);

      const mainHandCardStyle = Object.assign({}, handCardStyle);

      if (this.selectedCardIndexes.indexOf(c) >= 0) {
        mainHandCardStyle.transform = 'translate(' + 25 * c + 'px, -20px) rotate(' + (10 * c) + 'deg)';
        handCardStyle.transform = 'translate(' + 5 * c + 'px, -20px) rotate(' + (10 * c) + 'deg)';
      } else {
        mainHandCardStyle.transform = 'translateX(' + 20 * c + 'px) rotate(' + (10 * c) + 'deg)';
        mainHandCardStyle.marginLeft = '5px';
      }

      if (this.canPairCard(c) && this.selectedCardIndexes.length && this.selectedCardIndexes.indexOf(c) === -1) {
        mainHandCardStyle.border = '2px solid cornflowerblue';
      }

      mainHandCards.push(<div className="hand-card" key={c + 5} style={mainHandCardStyle} onClick={this.onSelectCard.bind(this, c)}></div>);
    }

    const handContainerStyles = {
      position: 'absolute',
      transform: 'translateY(-96px)'
    };

    const mainHandContainerStyles = {
      position: 'absolute',
      transformOrigin: '0 96px',
      transform: 'rotate(-20deg) scale(1.3) translate(-15px, 20px)',
      display: this.showHand ? 'block' : 'none'
    };

    return (
      <div id="game-container">
        <div ref="boardContainer" id="board-container">
          <div id="card-container" style={cardContainerStyles}>
            <div id="main-hand-container" style={mainHandContainerStyles}>
              {mainHandCards}
            </div>
            <div id="draw-pile" style={this.props.G.nextDrawableCard ? this.props.G.nextDrawableCard.getCardBackCoordinates() : {}}></div>
            <div id="discard-pile" style={this.props.G.lastPlayedCard ? this.props.G.lastPlayedCard.getSpriteCoordinates() : {}}></div>
          </div>
          <div ref="mainBoard" id="main-board" style={mainBoardStyles}>{slabContainers}</div>
          <div id="hand-container" ref="handContainer" onClick={this.onHandClick.bind(this)} style={handContainerStyles}>
            {handCards}
          </div>
        </div>
      </div>
    );
  }
}