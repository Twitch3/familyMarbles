import React from 'react';
import ReactDOM from 'react-dom';
import './GameBoard.css';

export class GameBoard extends React.Component {
  onClick(id) {
    if (this.isActive(id)) {
      this.props.moves.clickCell(id);
      this.props.events.endTurn();
    }
  }

  isActive(id) {
    if (!this.props.isActive) return false;
    if (this.props.G.cells[id] !== null) return false;
    return true;
  }

  componentDidMount() {
      // TODO: Replace findDOMNode with more appropriate resize method to scale board
      console.log(ReactDOM.findDOMNode(this));
  }

  render() {
    let winner = '';
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
          <div id="winner">Draw!</div>
        );
    }
    let numPlayers = 6;

    const cellSize = 20;
    const cellMargin = 5;
    const slabWidth = ((cellSize + cellMargin) * 18);

    const boardInRadius = slabWidth / (2 * Math.tan(Math.PI/numPlayers));
    const boardCircumRadius = slabWidth / (2 * Math.sin(Math.PI/numPlayers));

    let boardCircleDiameter = boardCircumRadius * 2;

    const cellStyles = {
        width: cellSize + 'px',
        height: cellSize + 'px',
        marginLeft: cellMargin + 'px'
    };

    const slabStyles = {
        width: slabWidth + 'px'
    }

    let boardSlabs = [];
    
    for (let i = 0; i < numPlayers; i++) {
      let cells = [];
      for (let j = 0; j < 18; j++) {
        const id = 3 * i + j;
        cells.push(
          <div className='board-cell' style={cellStyles} key={id} onClick={() => this.onClick(id)}>
            {this.props.G.cells[id]}
          </div>
        );
      }
      boardSlabs.push(<div className='board-slab' style={slabStyles} key={i}>{cells}</div>);
    }

    const rotationalAngle = 180 - (((numPlayers - 2) * 180) / numPlayers);

    function connectSlabs(slabs, index) {
        const styles = {
            width: slabWidth
        };
        if (index === 0) {
            const centerCirumcircleX = boardCircleDiameter/2;
            const centerCirumcircleY = centerCirumcircleX;
            const centerPolygonX = (cellSize/2) + cellMargin + (slabWidth/2);
            const centerPolygonY = (cellSize/2) + boardInRadius;

            styles.top = boardCircleDiameter - cellSize + 'px';
            styles.transform = 'translate(' + (centerCirumcircleX - centerPolygonX) + 'px, -'+ (centerCirumcircleY - centerPolygonY) +'px)';
        } else {
            styles.left = 18 * (cellSize + cellMargin) + 'px';
            styles.transformOrigin = (cellSize/2 + cellMargin) + 'px ' + (cellSize/2) + 'px';
            styles.transform = 'rotate(-' + rotationalAngle + 'deg)';
        }
        if (index === slabs.length) {
            return null;
        }
        return <div className='slab-container' style={styles}>{slabs[index]}{connectSlabs(slabs, index+1)}</div>;
    };

    let slabContainers = connectSlabs(boardSlabs, 0);

    const mainBoardStyles = {
        width: boardCircleDiameter + 'px',
        height: boardCircleDiameter + 'px',
        transform: 'translate('+ cellSize +'px, '+ cellSize +'px)',
    };

    return (
      <div id="game-container">
        <div id="board-container">
          <div id="main-board" style={mainBoardStyles}>{slabContainers}</div>
        </div>
        {winner}
      </div>
    );
  }
}