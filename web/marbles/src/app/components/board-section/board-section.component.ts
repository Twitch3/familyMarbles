import { Component, OnInit, Input } from '@angular/core';
import { BoardSection } from '../../classes/board-section';

@Component({
  selector: 'app-board-section',
  templateUrl: './board-section.component.html',
  styleUrls: ['./board-section.component.scss']
})
export class BoardSectionComponent implements OnInit {

  @Input() boardSection: BoardSection;

  constructor() { }

  ngOnInit() {
    // console.log(this.boardSection);
  }

}
