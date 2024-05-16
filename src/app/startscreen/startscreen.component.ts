import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit {
  hideImage: boolean = false;

  constructor(public authService: AuthenticationService) { }

  /**
 * Angular lifecycle hook that runs after component initialization.
 * Sets a timeout to hide the image and show the login form.
 */
  ngOnInit(): void {
    setTimeout(() => {
      this.hideImage = true;
      this.authService.showLogin = true;
    }, 1700);
  }

  /**
  * Redirects the user to the sign-up form.
  */
  redirectToSignUp(): void {
    this.authService.showSignUp = true;
    this.authService.showLogin = false;
    this.authService.forgotPassword = false;
  }

  /**
  * Redirects the user to the login form.
  */
  redirectToLogin(): void {
    this.authService.showLogin = true;
    this.authService.showSignUp = false;
    this.authService.forgotPassword = false;
  }


}
