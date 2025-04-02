import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, lastValueFrom } from 'rxjs';

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

  async signUp() {
    try {
      const response = await lastValueFrom(
        this.authService.signUp(this.signUpForm.value).pipe(
          catchError(error => {
            this.handleSignUpError();
            console.error('Sign-up error:', error);
            throw error;
          })
        )
      );
  
      this.handleSignUpSuccess();
  
    } catch (error) {
      console.error('Sign-up failed:', error);
    }
  }

  private handleSignUpSuccess() {
    this.snackBar.open('Successfully signed up! You can login now', 'close', {
      duration: 3000
    });

    this.signUpForm.reset();
  }

  private handleSignUpError() {
    this.snackBar.open('Error signing up. Are you using valid data?', 'close', {
      duration: 3000
    });

    this.signUpForm.reset();
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
