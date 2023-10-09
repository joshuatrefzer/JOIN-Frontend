import { Injectable } from '@angular/core';

export interface User {
  id:number;
  first_name:string;
  last_name:string;
  email:string;
  phone:string;
  active:boolean;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  login(user: User) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
