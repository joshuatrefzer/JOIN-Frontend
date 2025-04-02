import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
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
  userIsLoggedIn: WritableSignal<boolean> = signal(false);

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
