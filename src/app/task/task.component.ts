import { Component, computed, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { Contact, ContactService } from '../services/contact.service';
import { SubtaskService } from '../services/subtask.service';
import { PoupService } from '../services/poup.service';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    standalone: false
})
export class TaskComponent implements OnInit {
  @Input() task:Task | undefined;
  mytask: any;


  contacts = computed(() => {
    return this.contactService.contacts().filter(c => this.mytask.assigned_to.includes(c.id));
  });

  subtasks = computed(() => {
    return this.subtaskService.subtasks().filter( st => this.mytask.subtasks.includes(st.id)) ;
  });

  doneSubtasks = computed(() => {
    return this.subtasks().filter(st => st.done).length;
  });

  progressBarValue: number = 0;
  count: number = 0;
  openMoveTaskPopup: boolean = false;

  overdue: boolean = false;

  constructor(
    public taskService: TaskService,
    public contactService: ContactService,
    public popupService: PoupService,
    public subtaskService: SubtaskService,
  ) { }


  ngOnInit(): void {
    this.mytask = this.task;
    this.checkForOverdueDate();
  }

  checkForOverdueDate(): void {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; 
    this.overdue = currentDate > this.mytask.date;
  }

  moveTaskPopup() {
    this.openMoveTaskPopup = true;
  }

  
  /**
  * Updates the task status and closes the move task popup.
  * @param {string} status - The new status for the task.
  */
  moveTask(status: string) {
    if (!this.task) return;
    this.task.status = status;
    this.taskService.updateTaskStatus(this.task, this.task.id);
    this.openMoveTaskPopup = false;
  }

}
