import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    standalone: false
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
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  onSubmit() {
    this.signUp();
  }

  /**
 * Handles the sign-up process.
 */
signUp() {
  this.authService.signUp(this.signUpForm.value).subscribe(
      response => {
          this.handleSignUpSuccess();
      },
      error => {
          this.handleSignUpError();
      }
  );
}

/**
* Handles successful sign-up response.
*/
private handleSignUpSuccess() {
  // Show success message
  this.snackBar.open('Successfully signed up! You can login now', 'close', {
      duration: 3000
  });

  // Reset the sign-up form
  this.signUpForm.reset();
}

/**
* Handles sign-up error.
*/
private handleSignUpError() {
  // Show error message
  this.snackBar.open('Error signing up. Are you using valid data?', 'close', {
      duration: 3000
  });

  // Reset the sign-up form
  this.signUpForm.reset();
}

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
