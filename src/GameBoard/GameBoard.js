import React from 'react';
import './GameBoard.css';

export class GameBoard extends React.Component {

  onCellClick(id) {
    // TODO: Handle cell clicks. Cells should be active only after cards have been selected.
  }

  updateDimensions() {
    const mainHeight = this.refs.mainBoard.offsetHeight + (this.cellSize * 2);
    const mainWidth = this.refs.mainBoard.offsetWidth + (this.cellSize * 2);
    const containerHeight = document.body.clientHeight;
    const containerWidth = document.body.clientWidth;
    const heightRatio = containerHeight / mainHeight;
    const widthRatio = containerWidth / mainWidth;
    const ratio = heightRatio < widthRatio ? heightRatio : widthRatio;

    // TODO: Consider changing the width of the board to be the width of the regular polygon rather than the bounding circumcircle.
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
    let numPlayers = 4;

    const cellSize = 20;
    this.cellSize = cellSize;
    const cellMargin = 5;
    const slabWidth = ((cellSize + cellMargin) * 18);

    const boardInRadius = slabWidth / (2 * Math.tan(Math.PI / numPlayers));
    const boardCircumRadius = slabWidth / (2 * Math.sin(Math.PI / numPlayers));

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
          <div className='board-cell' style={cellStyles} key={id} onClick={() => this.onCellClick(id)}>
            {this.props.G.cells[id]}
          </div>
        );
      }
      boardSlabs.push(<div className='board-slab' style={slabStyles} key={i}>{cells}</div>);
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
      transform: 'translate(' + cellSize + 'px, ' + cellSize + 'px)',
    };

    return (
      <div id="game-container">
        <div ref="boardContainer" id="board-container">
          <div ref="mainBoard" id="main-board" style={mainBoardStyles}>{slabContainers}</div>
        </div>
      </div>
    );
  }
}