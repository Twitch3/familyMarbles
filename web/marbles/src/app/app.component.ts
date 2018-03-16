import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public settingsReady: boolean = true;
  title = 'app'; // TODO - update unit tests when more functionality exist
}
