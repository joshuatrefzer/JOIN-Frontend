import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  showLogin:boolean =false;
  showSignUp:boolean = false;
  forgotPassword:boolean = false;
  userIsLoggedIn:boolean = false;

  constructor() { }

}
