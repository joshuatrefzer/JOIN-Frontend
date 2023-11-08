import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
  ) {
    this.lenghtUrgentTasks = this.countUrgentTasks();
  }

  lenghtUrgentTasks: number = 0;

  countUrgentTasks() {
    let count = 0;
    this.taskService.tasks.forEach(task => {
      if (task.prio == 'urgent') {
        count++;
      }
    })
    return count;
  }


  ngOnInit(): void {
    this.templateService.summary = true;
  }

  hoverLeftButton() {

  }




  hoverOffLeftButton() {

  }


  ngOnDestroy(): void {
    this.templateService.summary = false;

  }


}
