import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.service';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private baseurl = environment.baseUrl;

  showLogin: boolean = false;
  showSignUp: boolean = false;
  forgotPassword: boolean = false;
  userIsLoggedIn: WritableSignal<boolean> = signal(false);

  constructor(private http: HttpClient) { }

  signUp(userData: Partial<User>): Observable<any> {
    let url = this.baseurl + '/signup/';
    return this.http.post<any>(url, userData);
  }

  login(userData: Partial<User>): Observable<any> {
    let url = this.baseurl + '/login/';
    return this.http.post<any>(url, userData);
  }
  
}
