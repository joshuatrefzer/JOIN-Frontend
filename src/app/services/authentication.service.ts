import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private baseurl = 'https://joshuatrefzer.pythonanywhere.com';

  showLogin: boolean = false;
  showSignUp: boolean = false;
  forgotPassword: boolean = false;
  userIsLoggedIn: boolean = false;

  constructor(private http: HttpClient) { }

  /**
 * Sends a POST request to the server to sign up a new user.
 * @param {any} userData - The user data to be sent for sign up.
 * @returns {Observable<any>} - An observable that emits the response from the server.
 */
  signUp(userData: any): Observable<any> {
    let url = this.baseurl + '/signup/';
    return this.http.post<any>(url, userData);
  }


  /**
  * Sends a POST request to the server to log in an existing user.
  * @param {any} userData - The user data to be sent for login.
  * @returns {Observable<any>} - An observable that emits the response from the server.
  */
  login(userData: any): Observable<any> {
    let url = this.baseurl + '/login/';
    return this.http.post<any>(url, userData);
  }
  
}
