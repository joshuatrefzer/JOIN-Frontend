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
  progressBarValue:number = 50; 

  constructor(
    public taskService: TaskService,
    public contactService: ContactService,
    public popupService:PoupService,
    public subtaskService: SubtaskService,
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['task']){
      console.log('Task Input Change:', changes['task'])
    }
  }

  ngOnInit(): void {
    this.getContacts();
    this.getSubTasks();
    this.mytask = this.task;
    console.log(this.mytask);
  }

  doneSubtasks(){
    let count = 0;
    this.subtasks.forEach( st => {
      if (st.done) {
        count++;
      }
    })
    this.progressBarValue =  this.getPercentage(count);
    return count;
  }


  getPercentage(count:number) {
    let percentage = (count / this.subtasks.length) * 100 ;
    return percentage;
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
