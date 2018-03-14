import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { BoardSectionComponent } from './components/board-section/board-section.component';
import { SpaceComponent } from './components/space/space.component';
import { PlayerComponent } from './components/player/player.component';
import { TeamComponent } from './components/team/team.component';
import { MarbleComponent } from './components/marble/marble.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardSectionComponent,
    SpaceComponent,
    PlayerComponent,
    TeamComponent,
    MarbleComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
