import { Component, OnDestroy, OnInit } from '@angular/core';
import { PoupService } from '../services/poup.service';
import { Task, TaskService } from '../services/task.service';
import { SubTask, SubtaskService } from '../services/subtask.service';

@Component({
    selector: 'app-task-for-view',
    templateUrl: './task-for-view.component.html',
    styleUrls: ['./task-for-view.component.scss'],
    standalone: false
})
export class TaskForViewComponent implements OnInit, OnDestroy {

  task: Task | undefined;
  formattedDate: string = "";

  constructor(
    public popupService: PoupService,
    public subTaskService: SubtaskService,
    public taskService: TaskService,

  ) { }

  ngOnInit(): void {
    if (this.popupService.taskPopupForView) {
      this.task = this.popupService.taskPopupForView;
    }
    this.formatDate();
  }

  updateCheckbox(id: number, subtask: SubTask) {
    this.subTaskService.updateSubtaskCheckbox(id, subtask);
  }

  
  /**
 * Formats the task's date into a human-readable string.
 * If the task has a date, it will format it as "Weekday, Day Month Year".
 * Otherwise, it logs that no date is available for the task.
 */
  formatDate() {
    if (this.task?.date) {
      const date = new Date(this.task.date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const formattedDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + date.toLocaleDateString('en-US', { month: 'long' }) + ' ' + date.getFullYear();
      this.formattedDate = formattedDate;
    } else {
      console.log('No Date available in', this.task);
    }
  }


  /**
  * Lifecycle hook that is called when the component is destroyed.
  * Resets task-related popup service properties unless the edit task popup is open.
  */
  ngOnDestroy(): void {
    if (!this.popupService.editTaskPopup) {
      this.task = undefined;
      this.popupService.taskPopupContacts = [];
      this.popupService.taskPopupSubtasks = [];
    } else {
      return;
    }
  }


  /**
  * Opens the edit task popup for the specified task.
  * @param {any} task - The task to be edited.
  */
  openEditTaskPopup(task?: Task) {
    if (!task) return;
      
    
    this.popupService.closePopups();
    this.popupService.editTask(task);
  }


  /**
  * Deletes the specified task and closes any open popups.
  * @param {any} id - The ID of the task to be deleted.
  */
  deleteTask(id?: number) {
    if(!id) return;
    this.taskService.deleteTask(id);
    this.popupService.closePopups();
  }


}
