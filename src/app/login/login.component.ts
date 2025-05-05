import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { User, UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { PoupService } from '../services/poup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {

  isChecked: boolean = false;
  user: User | undefined;

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
    this.authService.userIsLoggedIn.set(true);
    this.redirectToApp();
  }

  async login(type: string) {
    let json;
    if (this.loginForm.valid && type === 'login') {
      json = this.loginForm.value;
    } else if (type === 'guest') {
      json = this.guestUser;
    } else {
      this.loginError();
      return;
    }
  
    this.popupService.loader = true;
  
    try {
      const response = await lastValueFrom(
        this.authService.login(json).pipe(
          catchError(error => {
            this.handleLoginError();
            throw error;
          })
        )
      );
      
      this.handleSuccessfulLogin(response);
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  private handleSuccessfulLogin(response:any) {
    this.snackBar.open('Login Successful', 'close', {
      duration: 3000,
      panelClass: ['blue-snackbar']
    });

    const token = response.token;
    localStorage.setItem('Token', token);

    this.userService.currentUser = response.user;
    this.authService.userIsLoggedIn.set(true);

    this.popupService.loader = false;
    this.redirectToApp();
  }

  private handleLoginError() {
    this.snackBar.open('Something went wrong, try again!', 'close', {
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
