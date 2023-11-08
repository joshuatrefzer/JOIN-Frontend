import { Injectable } from '@angular/core';
import { User } from './user.service';
import { Contact } from './contact.service';
import { Task } from './task.service';
import { SubTask } from './subtask.service';

@Injectable({
  providedIn: 'root'
})
export class PoupService {
  showAddContactPopup:boolean = false;
  behindPopupContainer:boolean = false;
  addTaskPopup:boolean = false;
  editTaskPopup:boolean = false;
  addContact:boolean = false;
  editContact:boolean = false;
  contactForView: Contact | null = null;
  taskToEdit:{} | Task = {};
  

  taskPopupForView:Task |null = null;
  taskPopupContacts:Contact[] = []; 
  taskPopupSubtasks:SubTask[] = []; 

  constructor() { }

  closePopups() {
    this.behindPopupContainer = false;
    this.addContact = false;
    this.editContact = false;
    this.addTaskPopup = false;
    this.taskPopupForView = null;
    this.editTaskPopup = false;
  }

  showTaskPopup(task:Task, subtasks:SubTask[], contacts:Contact[] ) {
    this.behindPopupContainer = true;
    this.taskPopupForView = task;
    this.taskPopupContacts = contacts;
    this.taskPopupSubtasks = subtasks;
  }


  editTask() {
    this.behindPopupContainer = true;
    this.editTaskPopup = true;
  }

}
