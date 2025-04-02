import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'app-startscreen',
    templateUrl: './startscreen.component.html',
    styleUrls: ['./startscreen.component.scss'],
    standalone: false
})
export class StartscreenComponent implements OnInit {
  hideImage: boolean = false;

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.hideImage = true;
      this.authService.showLogin = true;
    }, 1700);
  }

  redirectToSignUp(): void {
    this.authService.showSignUp = true;
    this.authService.showLogin = false;
    this.authService.forgotPassword = false;
  }

  redirectToLogin(): void {
    this.authService.showLogin = true;
    this.authService.showSignUp = false;
    this.authService.forgotPassword = false;
  }

}
