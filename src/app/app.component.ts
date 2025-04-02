import { AfterViewInit, Component, computed, effect, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { PoupService } from './services/poup.service';
import { ContactService } from './services/contact.service';
import { SubtaskService } from './services/subtask.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})

export class AppComponent implements OnInit {
  title = 'JOIN';
  token: boolean = false;

  constructor(
    public authService: AuthenticationService,
    public popupService: PoupService,
    public contactService: ContactService,
    public subTaskService: SubtaskService,
    private taskService: TaskService,
    private route: ActivatedRoute,
  ) { 
    effect(() => {
      if (this.authService.userIsLoggedIn()) { 
        this.fetchData();
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Token')) {
      this.authService.userIsLoggedIn.set(true);
    } else {
      this.authService.userIsLoggedIn.set(false);
    }

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token && token.length > 10) {
        this.token = true;
      }
    });
  }

  private fetchData(){
    if (this.authService.userIsLoggedIn()) {
      this.popupService.loader = true;
      this.contactService.getContacts();
      this.taskService.getTasks();
      this.subTaskService.getSubTasks();
      setTimeout(() => {
        this.popupService.loader = false;
      }, 800);
    }
  }
  
}
