import { Injectable } from '@angular/core';

export interface User {
  id:number;
  username:string;
  email:string;
  token:string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  public currentUser:any = {
    "username": 'GuestUser',
  
  };

  

  constructor() { }
}
