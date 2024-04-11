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
  ) { }

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
    this.taskService.myTasks$.subscribe(data => {
      this.lenghtUrgentTasks = this.countUrgentTasks();
    });
    
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
    console.log('1' , taskDates);
    
    const futureDates = taskDates.filter(date => date > currentDate);
    console.log('2' , futureDates);
    
    futureDates.sort((a, b) => b.getTime() - a.getTime());
  
    const nearestDate = futureDates[0];
    return nearestDate ? this.formatDate(nearestDate) : 'No upcoming deadline';
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}








}
