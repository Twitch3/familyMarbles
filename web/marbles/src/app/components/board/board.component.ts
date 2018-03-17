import { Component, OnInit } from '@angular/core';
import { BoardSection } from '../../classes/board-section';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public NUM_PLAYERS = 1;
  public BOARD_SECTIONS: BoardSection[] = [];

  constructor() {
    for (let i = 0; i < this.NUM_PLAYERS; i++) {
      this.BOARD_SECTIONS.push(new BoardSection());
    }
  }

  ngOnInit() {
  }

}
