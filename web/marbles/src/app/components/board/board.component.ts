import { Component, OnInit } from '@angular/core';
import { BoardSection } from '../../classes/board-section';
import { BoardStyleService } from '../../services/board-style.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public NUM_PLAYERS = 4;
  public BOARD_SECTIONS: BoardSection[] = [];

  constructor(private boardSectionStyleService: BoardStyleService) {
    for (let i = 0; i < this.NUM_PLAYERS; i++) {
      this.BOARD_SECTIONS.push(new BoardSection());
    }
  }

  ngOnInit() {
  }

  getBoardStyle() {
    if (this.NUM_PLAYERS === 4) {
      return { transform: 'translate(30%, 80%)' };
    } else {
      return { transform: 'translate(20%, 70%) scale(0.7)' };
    }
  }

  getBoardSectionStyle(boardPosition: number): any {
    if (this.NUM_PLAYERS === 4) {
      console.log(this.boardSectionStyleService.getFourPlayerStyles(boardPosition));
      return this.boardSectionStyleService.getFourPlayerStyles(boardPosition);
    } else {
      return this.boardSectionStyleService.getSixPlayerStyles(boardPosition);
    }
    // return this.boardSectionStyleService.getBoardSectionStyleObj(boardPosition, this.NUM_PLAYERS);
  }

}
