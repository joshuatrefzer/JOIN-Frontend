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


  formatDate() {
    if (this.task?.date) {
      const date = new Date(this.task.date);
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const formattedDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + date.toLocaleDateString('en-US', { month: 'long' }) + ' ' + date.getFullYear();
      this.formattedDate = formattedDate;
    } 
  }

  ngOnDestroy(): void {
    if (!this.popupService.editTaskPopup) {
      this.task = undefined;
      this.popupService.taskPopupContacts = [];
      this.popupService.taskPopupSubtasks = [];
    } else {
      return;
    }
  }

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
