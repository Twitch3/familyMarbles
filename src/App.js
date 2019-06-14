import React from 'react'
import { Client } from 'boardgame.io/react';
import { GameBoard } from './GameBoard/GameBoard'
import Marbles from './Marbles/Marbles';

const numPlayers = 4;

const MarblesGame = Client({ game: Marbles, numPlayers: numPlayers, board: GameBoard, debug: false, multiplayer: { local: true } });

const playerBoards = [];

for(let i = 0; i < numPlayers; i++) {
    playerBoards.push(<MarblesGame playerID={''+i} key={i} />);
}

const App = () => (
    <div>
      { playerBoards }
    </div>
  );

export default App;