import { Component, computed } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    standalone: false
})
export class SummaryComponent {

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
    public userService: UserService,
  ) { }

  greeting: string = this.getGreeting();

  amountUrgendTasks = computed(() => {
    return this.taskService.tasks().filter(task => task.prio === 'urgent').length;
  });

  nextDate = computed(() => {
    const currentDate = new Date();
    const futureDates = this.taskService.tasks()
      .map(task => new Date(task.date))
      .filter(date => date > currentDate)
      .sort((a, b) => a.getTime() - b.getTime());
    return futureDates.length ? this.formatDate(futureDates[0]) : 'No upcoming deadline';
  });

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

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

}
