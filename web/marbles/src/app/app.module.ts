import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { BoardSectionComponent } from './components/board-section/board-section.component';
import { SpaceComponent } from './components/space/space.component';
import { PlayerComponent } from './components/player/player.component';
import { TeamComponent } from './components/team/team.component';
import { MarbleComponent } from './components/marble/marble.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { JoinGameComponent } from './components/game-menu/components/join-game/join-game.component';
import { CreateGameComponent } from './components/game-menu/components/create-game/create-game.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardSectionComponent,
    SpaceComponent,
    PlayerComponent,
    TeamComponent,
    MarbleComponent,
    GameMenuComponent,
    JoinGameComponent,
    CreateGameComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
