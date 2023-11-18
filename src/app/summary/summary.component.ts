import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
    public userService: UserService,
  ) {
    this.lenghtUrgentTasks = this.countUrgentTasks();
  }

  greeting: string = this.getGreeting();
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
    this.taskService.getTasks();
  }


  ngOnDestroy(): void {
    this.templateService.summary = false;
  }

  getGreeting() {
    let date = new Date();
    let hour = date.getHours();
    let greeting = "";

    if (hour >= 6 && hour < 12) {
      greeting = "Good Morning,";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good Afternoon,";
    } else {
      greeting = "Good Evening,";
    }

    return greeting;
  }

  getNextDate() {
    const currentDate = new Date();
    const taskDates = this.taskService.tasks.map(t => new Date(t.date));
  
    // Filtert die Datumsangaben, die in der Zukunft liegen
    const futureDates = taskDates.filter(date => date > currentDate);
  
    // Sortiere die zukünftigen Datumsangaben absteigend
    futureDates.sort((a, b) => b.getTime() - a.getTime());
  
    // Das erste Element im sortierten Array ist das nächste Datum
    const nearestDate = futureDates[0];
  
    return nearestDate?.toISOString().split('T')[0];
  }








}
