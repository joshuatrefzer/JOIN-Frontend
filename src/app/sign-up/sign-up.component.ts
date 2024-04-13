import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  onSubmit() {
    this.signUp();
  }

  signUp() {
    this.authService.signUp(this.signUpForm.value).subscribe(
      response => {
        this.snackBar.open('Successful signed up! You can login now', 'close', {
          duration: 3000
        });
        this.signUpForm.reset();
      },
      error => {
        this.snackBar.open('Error by signing up, do you user valid data?', 'close', {
          duration: 3000
        });
        this.signUpForm.reset();
      }
    );
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
