import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { Contact, ContactService } from '../services/contact.service';
import { SubtaskService, SubTask } from '../services/subtask.service';
import { PoupService } from '../services/poup.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges {
  @Input() task: any;

  mytask: any;
  contacts: Contact[] = [];
  subtasks: SubTask[] = [];
  progressBarValue: number = 0;
  count: number = 0;
  openMoveTaskPopup:boolean = false;

  constructor(
    public taskService: TaskService,
    public contactService: ContactService,
    public popupService: PoupService,
    public subtaskService: SubtaskService,
  ) { 
    

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      console.log('Here changes');
    }
  }

  ngOnInit(): void {
    this.getContacts();
    this.getSubTasks();
    this.mytask = this.task;
    
    this.subtaskService.mySubTasks$.subscribe(() => {
      this.getSubTasks();
    });
  }

  doneSubtasks() {
    let count = 0;
    this.subtasks.forEach(st => {
      if (st.done) {
        count++;
      }
    })
    this.progressBarValue = this.getPercentage(count);
    this.count = count;
  }


  getPercentage(count: number) {
    let percentage = (count / this.subtasks.length) * 100;
    return percentage;
  }

  getContacts() {
    this.task.assigned_to.forEach((contactId: number) => {
      const index = this.contactService.contacts.findIndex(c => c.id == contactId);
      if (index != -1) {
        this.contacts.push(this.contactService.contacts[index])
      }
    });
  }

  getSubTasks() {
    this.subtasks = [];
    this.task.subtasks.forEach((stId: number) => {
      const index = this.subtaskService.subTasks.findIndex(s => s.id == stId);
      if (index != -1) {
        this.subtasks.push(this.subtaskService.subTasks[index])
      }
    });
    this.doneSubtasks();
  }

  moveTaskPopup(){
    this.openMoveTaskPopup = true;
  }

  moveTask(status:string){
    this.task.status = status;
    this.taskService.updateTaskStatus(this.task , this.task.id);
    this.openMoveTaskPopup = false;
  }





}
