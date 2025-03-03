import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { Contact, ContactService } from '../services/contact.service';
import { SubtaskService, SubTask } from '../services/subtask.service';
import { PoupService } from '../services/poup.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    standalone: false
})
export class TaskComponent implements OnInit {
  @Input() task: any;

  mytask: any;
  contacts: Contact[] = [];
  subtasks: SubTask[] = [];
  progressBarValue: number = 0;
  count: number = 0;
  openMoveTaskPopup: boolean = false;

  overdue: boolean = false;

  constructor(
    public taskService: TaskService,
    public contactService: ContactService,
    public popupService: PoupService,
    public subtaskService: SubtaskService,
  ) { }


  /**
 * Angular lifecycle hook that is called after data-bound properties of a directive are initialized.
 * Initializes tasks, subtasks, and contacts, and subscribes to their updates.
 */
  ngOnInit(): void {
    this.getSubTasks();
    this.getContacts();
    this.mytask = this.task;

    this.subtaskService.mySubTasks$.subscribe(() => {
      this.getSubTasks();
    });

    this.contactService.myContacts$.subscribe(() => {
      this.getContacts();
    });

    this.checkDate();
  }


  /**
  * Checks if the task date is overdue.
  * Compares the current date with the task's date and sets the overdue property.
  */
  checkDate(): void {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Gets the date in 'YYYY-MM-DD' format

    this.overdue = currentDate > this.mytask.date;
  }

  /**
 * Counts the number of completed subtasks and updates the progress bar value.
 * Also sets the count of completed subtasks.
 */
  doneSubtasks(): void {
    let count = this.subtasks.filter(st => st.done).length;
    this.progressBarValue = this.getPercentage(count);
    this.count = count;
  }

  /**
  * Calculates the percentage of completed subtasks.
  * @param {number} count - The number of completed subtasks.
  * @returns {number} The percentage of completed subtasks.
  */
  getPercentage(count: number): number {
    return (count / this.subtasks.length) * 100;
  }


  /**
  * Retrieves the contacts assigned to the task.
  * If a contact is not found locally, it fetches all contacts from the server.
  */
  getContacts(): void {
    this.contacts = [];
    this.task.assigned_to.forEach((contactId: number) => {
      const contact = this.contactService.contacts.find(c => c.id === contactId);
      if (contact) {
        this.contacts.push(contact);
      } else {
        this.contactService.fetchContacts();
      }
    });
  }


  /**
 * Retrieves the subtasks associated with the task.
 * It populates the `subtasks` array with matching subtasks from the subtask service.
 * After retrieving subtasks, it updates the progress of completed subtasks.
 */
  getSubTasks() {
    this.subtasks = [];
    this.task.subtasks.forEach((stId: number) => {
      const index = this.subtaskService.subTasks.findIndex(s => s.id == stId);
      if (index != -1) {
        this.subtasks.push(this.subtaskService.subTasks[index])
      }
    });
    this.doneSubtasks();
  }


  /**
  * Opens the popup for moving the task to a different status.
  */
  moveTaskPopup() {
    this.openMoveTaskPopup = true;
  }


  /**
  * Updates the task status and closes the move task popup.
  * @param {string} status - The new status for the task.
  */
  moveTask(status: string) {
    this.task.status = status;
    this.taskService.updateTaskStatus(this.task, this.task.id);
    this.openMoveTaskPopup = false;
  }

}
