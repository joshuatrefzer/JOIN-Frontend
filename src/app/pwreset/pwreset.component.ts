import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-pwreset',
    templateUrl: './pwreset.component.html',
    styleUrls: ['./pwreset.component.scss'],
    standalone: false
})
export class PwresetComponent {

  public reset: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], [])
  });

  constructor(public authService: AuthenticationService, private router: Router, private http:HttpClient, private snackBar:MatSnackBar) { }

  onSubmit() {
    this.resetPW();
  }

  resetPW() {
    if (this.reset.valid) {
      const url = environment.baseUrl + '/password_reset/';
      const formData = new FormData();
      formData.append('email', this.reset.get('email')?.value);
      this.resetPasswordRequest(url, formData);
      this.reset.reset()
    } else {
      console.log('Please fill the field with a valid email adress');
    }
  }

  async resetPasswordRequest(url: string, formData: FormData) {
    try {
      await lastValueFrom(
        this.http.post(url, formData).pipe(
          catchError(error => {
            this.snackBar.open('Something went wrong..', 'close', { duration: 3000 });
            throw error; 
          })
        )
      );
  
      this.snackBar.open('Mail has been sent to you!', 'close', { duration: 3000 });
      this.reset.reset();
    } catch (error) {
      console.error('Error in resetPasswordRequest:', error);
    }
  }

  redirectToLogin() {
    this.authService.forgotPassword = false;
    this.authService.showLogin = true;
    this.authService.showSignUp = false;
  }
}


