import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pwreset',
  templateUrl: './pwreset.component.html',
  styleUrls: ['./pwreset.component.scss']
})
export class PwresetComponent {

constructor(public authService: AuthenticationService, private router: Router){}


onSubmit() {
  
throw new Error('Method not implemented.');
}

  public reset: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], [])

  });


  redirectToLogin() {
    this.authService.forgotPassword = false;
    this.authService.showLogin = true;
    this.authService.showSignUp = false;
  }


}


