import { Component, OnDestroy, OnInit } from '@angular/core';
import { PoupService } from '../services/poup.service';
import { Task } from '../services/task.service';

@Component({
  selector: 'app-task-for-view',
  templateUrl: './task-for-view.component.html',
  styleUrls: ['./task-for-view.component.scss']
})
export class TaskForViewComponent implements OnInit, OnDestroy{

  task:Task | undefined;
  constructor(public popupService: PoupService) {

  }

  ngOnInit():void { 
    if (this.popupService.taskPopupForView) {
      this.task = this.popupService.taskPopupForView;
    }
    
  }


  ngOnDestroy(): void {
    this.task = undefined;
  }


}
