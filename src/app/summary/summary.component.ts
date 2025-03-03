import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    standalone: false
})
export class SummaryComponent implements OnInit {

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
    public userService: UserService,
  ) { }

  greeting: string = this.getGreeting();
  lenghtUrgentTasks: number = 0;


  /**
 * Counts the number of urgent tasks.
 * @returns The count of tasks with priority 'urgent'.
 */
  countUrgentTasks(): number {
    return this.taskService.tasks().filter(task => task.prio === 'urgent').length;
  }


  /**
  * Angular lifecycle hook that runs after component initialization.
  * Fetches tasks and calculates the number of urgent tasks.
  */
  ngOnInit(): void {
    this.taskService.getTasks();


    // this.taskService.myTasks$.subscribe(() => {
    //   this.lenghtUrgentTasks = this.countUrgentTasks();
    // });



  }


  /**
 * Returns a greeting based on the current time.
 * @returns A greeting string.
 */
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return "Good Morning,";
    } else if (hour >= 12 && hour < 18) {
      return "Good Afternoon,";
    } else {
      return "Good Evening,";
    }
  }


  /**
  * Gets the nearest upcoming task date.
  * @returns A formatted string of the nearest upcoming date or a message indicating no upcoming deadlines.
  */
  getNextDate(): string {
    const currentDate = new Date();
    const futureDates = this.taskService.tasks()
      .map(task => new Date(task.date))
      .filter(date => date > currentDate)
      .sort((a, b) => a.getTime() - b.getTime());

    return futureDates.length ? this.formatDate(futureDates[0]) : 'No upcoming deadline';
  }


  /**
  * Formats a date into a readable string.
  * @param date - The date to format.
  * @returns The formatted date string.
  */
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }








}
