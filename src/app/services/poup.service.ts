import { Injectable } from '@angular/core';
import { User } from './user.service';
import { Contact } from './contact.service';
import { Task } from './task.service';
import { SubTask } from './subtask.service';

@Injectable({
  providedIn: 'root'
})
export class PoupService {
  showAddContactPopup: boolean = false;
  behindPopupContainer: boolean = false;
  addTaskPopup: boolean = false;
  editTaskPopup: boolean = false;
  addContact: boolean = false;
  editContact: boolean = false;
  contactForView: Contact | null = null;
  taskToEdit: Task | null = null;

  taskPopupForView: Task | null = null;
  taskPopupContacts: Contact[] = [];
  taskPopupSubtasks: SubTask[] = [];

  loader: boolean = false;

  constructor() { }


  /**
 * Closes all popups and resets related flags and properties.
 */
  closePopups() {
    this.behindPopupContainer = false;
    this.addContact = false;
    this.editContact = false;
    this.addTaskPopup = false;
    this.taskPopupForView = null;
    this.editTaskPopup = false;
  }


  /**
  * Displays a popup containing details of a specific task, including subtasks and assigned contacts.
  * @param task - The task object to be displayed in the popup.
  * @param subtasks - An array of subtasks associated with the task.
  * @param contacts - An array of contacts assigned to the task.
  */
  showTaskPopup(task: Task, subtasks: SubTask[], contacts: Contact[]) {
    this.behindPopupContainer = true;
    this.taskPopupForView = task;
    this.taskPopupContacts = contacts;
    this.taskPopupSubtasks = subtasks;
  }


  /**
  * Opens the edit task popup for modifying the details of a specific task.
  * @param task - The task object to be edited.
  */
  editTask(task: any) {
    this.behindPopupContainer = true;
    this.editTaskPopup = true;
    this.taskToEdit = task;
  }
}
