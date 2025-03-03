import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { PoupService } from './services/poup.service';
import { ContactService } from './services/contact.service';
import { SubtaskService } from './services/subtask.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
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

  /**
 * Initializes the component.
 * Checks if the user is logged in based on the presence of a token in local storage.
 * Checks for a token in query parameters and sets 'token' to true if the token is present and valid.
 */
  ngOnInit(): void {
    // Check if there is a token in local storage to determine if the user is logged in
    if (localStorage.getItem('Token')) {
      this.authService.userIsLoggedIn = true;
    } else {
      this.authService.userIsLoggedIn = false;
    }

    // Check for token in query parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token && token.length > 10) {
        this.token = true;
      }
    });
  }


}
