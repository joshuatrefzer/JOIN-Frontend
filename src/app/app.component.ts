import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { PoupService } from './services/poup.service';
import { ContactService } from './services/contact.service';
import { SubtaskService } from './services/subtask.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'JOIN';
  token: boolean = false;


  constructor(
    public authService: AuthenticationService,
    public popupService: PoupService,
    public contactService: ContactService,
    public subTaskService: SubtaskService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('Token')) {
      this.authService.userIsLoggedIn = true;
    } else {
      this.authService.userIsLoggedIn = false;
    }

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token && token.length > 10) {
        this.token= true;
      }
    });
  }


}
