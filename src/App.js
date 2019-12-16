import React from 'react'
import { Client } from 'boardgame.io/react';
import { GameBoard } from './GameBoard/GameBoard'
import Marbles from './Marbles/Marbles';

// TODO: Too many players results in not enough cards in a deck for an opening hand
// TODO: Too many players results in a small board which affects things like the scale of the hand sprites
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