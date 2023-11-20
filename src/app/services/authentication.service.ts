import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private baseurl  = 'http://localhost:8000';

  showLogin:boolean =false;
  showSignUp:boolean = false;
  forgotPassword:boolean = false;
  userIsLoggedIn:boolean = false;

  constructor(private http: HttpClient) { }

  signUp(userData: any): Observable<any> {
    let url = this.baseurl + '/signup/';
    return this.http.post<any>(url, userData);
  }

  login(userData: any): Observable<any> {
    let url = this.baseurl + '/login/';
    return this.http.post<any>(url, userData);
  }

  

}
