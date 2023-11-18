import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public signUpForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], []),

    password: new FormControl('', [
      Validators.required
    ], []),

    username: new FormControl('', [
      Validators.required
    ], []),

  });

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  onSubmit() {
    this.signUp();
  }

  signUp() {
    this.authService.signUp(this.signUpForm.value).subscribe(
      response => {
        //Token speichern im LS
        console.log(response);
        // this.redirectToLogin();
      },
      error => {
        console.error(error);
      }
    );
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
