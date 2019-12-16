import React from 'react';
import './GameBoard.css';
import { Card } from '../Classes/Card';
import { BoardMove } from '../Classes/BoardMove';
import { Cell } from '../Classes/Cell';
import { BoardMoveService } from '../Services/BoardMoveService';

export class GameBoard extends React.Component {

  constructor(gameSetup) {
    super(gameSetup);
    this.showHand = false;
    this.playerId = gameSetup.playerID;
    const state = this.props.G;
    this.player = state.players[this.playerId];
    this.selectedCardIndexes = [];
    this.selectedMarbleCells = [];
    this.playerMustDiscard = false;
    this.highlightedCells = [];
  }

  onCellEnter(id) {
    if (this.selectedCardIndexes.length) {
      const key = id.player + '/' + id.cellNumber + '/' + id.cellType;
      const marble = this.props.G.cellMap.getMarbleInCell(key);
      if (marble && marble.player === this.player.id) {
        const key = id.player + '/' + id.cellNumber + '/' + id.cellType;
        const cell = this.props.G.cellMap.getCellById(key);
        const moveDetails = new BoardMove(this.player, this.selectedCardIndexes);
        const nextCells = BoardMoveService.handleCellInteraction(cell, this.props.G.cellMap, this.player, moveDetails, true);
        if (nextCells) {
          nextCells.forEach(cell => {
            this.highlightedCells.push(cell.getCellId());
          });
          this.forceUpdate();
        }
      }
    }
  }

  onCellLeave() {
    this.highlightedCells = [];
    this.forceUpdate();
  }

  onCellClick(id) {
    if (this.selectedCardIndexes.length) {
      const key = id.player + '/' + id.cellNumber + '/' + id.cellType;
      const cell = this.props.G.cellMap.getCellById(key);
      const moveDetails = new BoardMove(this.player, this.selectedCardIndexes);
      const nextCells = BoardMoveService.handleCellInteraction(cell, this.props.G.cellMap, this.player, moveDetails);
      // TODO: Implement a better return value to be able to handle error messages from the Service
      if (this.props.ctx.currentPlayer === this.playerId) {
        if (nextCells) {
          if (nextCells.length === 1) {
            cell.moveMarbleToCell(nextCells[0], this.props.G.cellMap);
            this.props.moves.updateAfterMove(this.player, this.selectedCardIndexes);
            this.player.endTurn(this.selectedCardIndexes, this.props.G.deck);
            this.updateAfterMove();
          } else {
            console.log(nextCells);
            alert('Moves that require more input are in progress');
          }
        } else {
          alert('That move is not possible');
        }
      } else {
        alert('It is not your turn');
      }
    }
  }

  onHandClick() {
    this.showHand = !this.showHand;
    if (this.showHand && BoardMoveService.isPlayerStuck(this.props.G.cellMap, this.player)) {
      this.playerMustDiscard = true;
      alert('You have no valid moves');
    }
    this.forceUpdate();
  }

  // TODO: Solve for pairing face cards iff there's 3 of them since 2 shouldn't work.
  canPairCard(cardIndex) {
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
    } else if (this.player.hand[cardIndex].id === this.player.hand[this.selectedCardIndexes[0]].id) {
      if (
       this.player.hand[cardIndex].id === Card.IDS.JACK ||
       this.player.hand[cardIndex].id === Card.IDS.QUEEN ||
       this.player.hand[cardIndex].id === Card.IDS.KING ||
       this.player.hand[cardIndex].id === Card.IDS.ACE
      ) {
        const matchingCardIds = this.player.hand.filter( card => {
          return card.id === this.player.hand[cardIndex].id;
        });
        return matchingCardIds ? matchingCardIds.length === 3 : false;
      }
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

  updateAfterMove() {
    this.selectedCardIndexes = [];
    this.highlightedCells = [];
    this.playerMustDiscard = false;
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
          cellType: Cell.TYPES.MAIN
        };
        const mainKey = i + '/' + j + '/' + Cell.TYPES.MAIN;
        const mainCellMarble = this.props.G.cellMap.getMarbleInCell(mainKey);
        const mainCellIsHightlighted = this.highlightedCells.indexOf(mainKey);
        const mainCellStyle = {
          width: cellSize + 'px',
          height: cellSize + 'px',
          borderColor: mainCellMarble ? 'black' : playerColors[i],
          marginLeft: cellMargin + 'px',
          background: mainCellMarble ? playerColors[mainCellMarble.getOwnerId()] : ''
        };
        const highlightStyle = {
          display: mainCellIsHightlighted ? 'none' : 'block'
        };
        mainCells.push(
          <div className='board-cell' style={mainCellStyle} key={JSON.stringify(id)} onClick={() => this.onCellClick(id)} onMouseEnter={() => this.onCellEnter(id)} onMouseLeave={() => this.onCellLeave(id)}>
            <div className='cell-highlight' style={highlightStyle}></div>
          </div>
        );
      }
      for (let k = 0; k < 5; k++) {
        const completeCellSize = cellSize + cellMargin;

        const baseId = {
          player: i,
          cellNumber: k,
          cellType: Cell.TYPES.BASE
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
        const baseKey = i + '/' + k + '/' + Cell.TYPES.BASE;
        const baseCellMarble = this.props.G.cellMap.getMarbleInCell(baseKey);
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
          <div className='board-cell' style={baseCellStyle} key={JSON.stringify(baseId)} onClick={() => this.onCellClick(baseId)} onMouseEnter={() => this.onCellEnter(baseId)} onMouseLeave={() => this.onCellLeave(baseId)}>
          </div>
        );

        const homeId = {
          player: i,
          cellNumber: k,
          cellType: Cell.TYPES.HOME
        };
        const homeTranslateX = k > 2 ? (k + 1) : 3;
        const homeTranslateY = k < 2 ? (k + 1) : 3;
        const homeKey = i + '/' + k + '/' + Cell.TYPES.HOME;
        const homeCellMarble = this.props.G.cellMap.getMarbleInCell(homeKey);
        const homeCellIsHightlighted = this.highlightedCells.indexOf(homeKey);
        const homeCellStyle = {
          position: 'absolute',
          borderColor: homeCellMarble ? 'black' : playerColors[i],
          width: cellSize + 'px',
          height: cellSize + 'px',
          marginLeft: cellMargin + 'px',
          backgroundColor: homeCellMarble ? playerColors[i] : '',
          transform: 'translate(' + homeTranslateX * completeCellSize + 'px, -' + homeTranslateY * completeCellSize + 'px)'
        };
        const highlightStyle = {
          display: homeCellIsHightlighted ? 'none' : 'block'
        };
        homeCells.push(
          <div className='board-cell' style={homeCellStyle} key={JSON.stringify(homeId)} onClick={() => this.onCellClick(homeId)} onMouseEnter={() => this.onCellEnter(homeId)} onMouseLeave={() => this.onCellLeave(homeId)}>
            <div className='cell-highlight' style={highlightStyle}></div>
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

    const turnTrackerStyles = {
      color: playerColors[this.props.ctx.currentPlayer]
    };

    // const 

    return (
      <div id="game-container">
        <div ref="boardContainer" id="board-container">
        <div id="turn-tracker" style={turnTrackerStyles}>It's Player {parseInt(this.props.ctx.currentPlayer, 10) + 1}'s Turn</div>
        {/* <div id="context-messages">Contextual Messages Go Here</div> */}
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