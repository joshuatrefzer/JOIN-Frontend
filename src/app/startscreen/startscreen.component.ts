import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit {
  hideImage:boolean = false;

  constructor(public authService: AuthenticationService){}
  audio = new Audio('assets/audio/join.mp3');

  ngOnInit():void {
    // this.audio.play();
    setTimeout(() => {
      this.hideImage = true;
      this.authService.showLogin = true;
    }, 1700);
  }

  redirectToSignUp() {
    this.authService.showSignUp = true;
    this.authService.showLogin = false;
    this.authService.forgotPassword = false;
  }

  redirectToLogin() {
    this.authService.showLogin = true;
    this.authService.showSignUp = false;
    this.authService.forgotPassword = false;

  }


}
