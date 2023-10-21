import { Injectable } from '@angular/core';
import { User } from './user.service';
import { Contact } from './contact.service';

@Injectable({
  providedIn: 'root'
})
export class PoupService {
  showAddContactPopup:boolean = false;
  behindPopupContainer:boolean = false;
  addTaskPopup:boolean = false;
  addContact:boolean = false;
  editContact:boolean = false;
  contactForView: Contact | null = null;


  constructor() { }

  closePopups() {
    this.behindPopupContainer = false;
    this.addContact = false;
    this.editContact = false;
    this.addTaskPopup = false;
  }


}
