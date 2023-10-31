import { Component, Input, OnInit } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { Contact, ContactService } from '../services/contact.service';
import { SubtaskService, SubTask } from '../services/subtask.service';
import { PoupService } from '../services/poup.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task: any;

  mytask: any;
  contacts: Contact[] = [];
  subtasks: SubTask[] = [];

  constructor(
    public taskService: TaskService,
    public contactService: ContactService,
    public popupService:PoupService,
    public subtaskService: SubtaskService,
  ) {

  }

  ngOnInit(): void {
    this.getContacts();
    this.getSubTasks();
    this.mytask = this.task;
    console.log(this.mytask);
    
  }

  getContacts() {
    this.task.assigned_to.forEach((contactId: number) => {
      const index = this.contactService.contacts.findIndex( c =>  c.id == contactId);
      if (index != -1) {
        this.contacts.push(this.contactService.contacts[index])
      } 
    });
  }

  getSubTasks() {
    this.task.subtasks.forEach((stId: number) => {
      const index = this.subtaskService.subTasks.findIndex( s =>  s.id == stId);
      if (index != -1) {
        this.subtasks.push(this.subtaskService.subTasks[index])
      } 
    });
    

    //Hier für DONE -> Zahl ermitteln um Przentsatz auszurechnen -> Progressbar
    // this.subtasks.forEach(st => {
    //   if (st.done) {
        
    //   }
    // })
  }



}
