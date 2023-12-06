import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { PoupService } from './services/poup.service';
import { ContactService } from './services/contact.service';
import { SubtaskService } from './services/subtask.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  implements OnInit {
  title = 'JOIN';


  constructor(
    public authService: AuthenticationService,
    public popupService: PoupService,
    public contactService: ContactService,
    public subTaskService: SubtaskService,

    ){}

    ngOnInit(): void {
      
      if (localStorage.getItem('Token')) {
        this.authService.userIsLoggedIn = true;
      } else {
        this.authService.userIsLoggedIn = false;
      }
      
    }

  
}
