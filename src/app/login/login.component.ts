import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { User, UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { PoupService } from '../services/poup.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {


  isChecked: boolean = false;
  user: User = {} as User;

  guestUser = {
    'username': 'GuestAccount',
    'email': 'guestaccount@example.com',
    'password': 'Guest'
  }
  error: boolean = false;

  public loginForm: FormGroup = new FormGroup({

    username: new FormControl('', [
      Validators.required,
    ], []),

    password: new FormControl('', [
      Validators.required
    ], [])

  });


  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    public authService: AuthenticationService,
    public popupService: PoupService,
  ) {
  }


  onSubmit(type: string) {
    this.login(type);
  }

  redirectToPWReset() {
    this.authService.forgotPassword = true;
    this.authService.showLogin = false;
    this.authService.showSignUp = false;
  }

  loginAsGuest() {
    this.authService.userIsLoggedIn = true;
    this.redirectToApp();
  }


  /**
 * Performs login action based on the provided type.
 * 
 * @param {string} type The type of login action ('login' or 'guest').
 */
  login(type: string) {
    let json;
    // Check if the login form is valid and the type is 'login'
    if (this.loginForm.valid && type === 'login') {
      json = this.loginForm.value;
    } else if (type === 'guest') {
      // If the type is 'guest', use the guest user data
      json = this.guestUser;
    } else {
      // If the type is neither 'login' nor 'guest', show login error
      this.loginError();
      return;
    }

    // Show loader while processing login
    this.popupService.loader = true;

    // Perform login authentication
    this.authService.login(json).subscribe(
      (response: any) => {
        // On successful login
        this.handleSuccessfulLogin(response);
      },
      error => {
        // On login error
        this.handleLoginError();
      }
    );
  }

  /**
  * Handles successful login response.
  * 
  * @param {any} response The response object from the login request.
  */
  private handleSuccessfulLogin(response: any) {
    // Show success message
    this.snackBar.open('Login Successful', 'close', {
      duration: 3000,
      panelClass: ['blue-snackbar']
    });

    // Extract token from response and store in local storage
    const token = response.token;
    localStorage.setItem('Token', token);

    // Set current user in user service
    this.userService.currentUser = response.user;

    // Set user as logged in
    this.authService.userIsLoggedIn = true;

    // Hide loader and redirect to app
    this.popupService.loader = false;
    this.redirectToApp();
  }

  /**
  * Handles login error.
  */
  private handleLoginError() {
    // Show error message
    this.snackBar.open('Successful signed up! You can login now', 'close', {
      duration: 3000
    });
  }

  redirectToApp() {
    this.router.navigate(['/summary']);
  }

  loginError() {
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 2000);
  }



}
