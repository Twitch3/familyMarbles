import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { JoinGameComponent } from './components/game-menu/components/join-game/join-game.component';
import { CreateGameComponent } from './components/game-menu/components/create-game/create-game.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
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
