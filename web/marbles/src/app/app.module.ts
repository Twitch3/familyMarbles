import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { SpawnSectionComponent } from './components/spawn-section/spawn-section.component';
import { HomeSectionComponent } from './components/home-section/home-section.component';
import { BoardSectionComponent } from './components/board-section/board-section.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { JoinGameComponent } from './components/game-menu/components/join-game/join-game.component';
import { CreateGameComponent } from './components/game-menu/components/create-game/create-game.component';
import { SpaceComponent } from './components/space/space.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    GameMenuComponent,
    JoinGameComponent,
    CreateGameComponent,
    SpaceComponent,
    SpawnSectionComponent,
    HomeSectionComponent,
    BoardSectionComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
