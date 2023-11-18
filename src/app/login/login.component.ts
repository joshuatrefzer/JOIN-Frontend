import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { User, UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  // passwordFormControl = new FormControl('', [Validators.required]);
  // firstnameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  // lastnameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  isChecked: boolean = false;

  user: User = {} as User;

  public loginForm: FormGroup = new FormGroup({

    username: new FormControl('', [
      Validators.required,
    ], []),

    password: new FormControl('', [
      Validators.required
    ], []),

    isChecked: new FormControl('')

  });


  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    public authService: AuthenticationService,

  ) {
  }


  onSubmit() {
    console.log(this.loginForm);
    this.login();
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


  login() {
    this.authService.login(this.loginForm.value).subscribe(
      (response: any) => {
        console.log(response, 'Successfully logged in!');
        const token = response.token;
        localStorage.setItem('Token', token);
        this.userService.currentUser = response.user;
        console.log(this.userService.currentUser);
        this.authService.userIsLoggedIn = true;
        this.redirectToApp();
      },
      error => {
        console.error(error);
      }
    );
  }

  redirectToApp() {
    this.router.navigate(['/summary']);
  }



}
