import { Component, OnDestroy, OnInit } from '@angular/core';
import { PoupService } from '../services/poup.service';
import { Task } from '../services/task.service';

@Component({
  selector: 'app-task-for-view',
  templateUrl: './task-for-view.component.html',
  styleUrls: ['./task-for-view.component.scss']
})
export class TaskForViewComponent implements OnInit, OnDestroy {

  task: Task | undefined;
  formattedDate:string = "";
  
  constructor(public popupService: PoupService) {

  }

  ngOnInit(): void {
    if (this.popupService.taskPopupForView) {
      this.task = this.popupService.taskPopupForView;
    }
    this.formatDate();
  }

  formatDate() {
    if (this.task?.date) {
      const date = new Date(this.task.date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const formattedDate = weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + date.toLocaleDateString('en-US', { month: 'long' }) + ' ' + date.getFullYear();
      this.formattedDate = formattedDate;
    } else {
      console.log('No Date availabe in', this.task);
      
    }
  }


  ngOnDestroy(): void {
    this.task = undefined;
    this.popupService.taskPopupContacts = [];
    this.popupService.taskPopupSubtasks = [];
  }


}
