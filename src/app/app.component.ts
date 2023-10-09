import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { PoupService } from './services/poup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'JOIN';


  constructor(
    public authService: AuthenticationService,
    public popupService: PoupService,

    ){}

  
}
