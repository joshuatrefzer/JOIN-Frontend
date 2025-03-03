import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      const url = 'https://joshuatrefzer.pythonanywhere.com' + '/password_reset/';
      const formData = new FormData();
      formData.append('email', this.reset.get('email')?.value);
      this.resetPasswordRequest(url, formData);
      this.reset.reset()
    } else {
      console.log('Please fill the field with a valid email adress');
    }
  }

  /**
  * Sends a POST request to the password reset endpoint with the provided email address.
  *
  * This function takes a URL and a FormData object containing the email address. It then:
  *  - Sets a loader indicator to true using `this.auth.loader`.
  *  - Makes a POST request to the URL with the FormData.
  *  - On success, hides the loader, displays a success message using `ps.messagePopup`, and resets the email form.
  *  - On error, hides the loader, and displays an error message using `ps.errorPopup`.
  *
  * @param {string} url - The URL of the password reset endpoint.
  * @param {FormData} formData - A FormData object containing the email address (`email`).
  */
  resetPasswordRequest(url: string, formData: FormData) {
    this.http.post(url, formData).subscribe(res => {
      this.snackBar.open('Mail has been sent to you!', 'close', {
        duration: 3000
      });
      this.reset.reset();
    }, (error: any) => {
      this.snackBar.open('Something went wrong..', 'close', {
        duration: 3000
      });
    });
  }


  redirectToLogin() {
    this.authService.forgotPassword = false;
    this.authService.showLogin = true;
    this.authService.showSignUp = false;
  }


}


