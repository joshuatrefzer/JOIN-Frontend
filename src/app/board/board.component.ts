import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { Task, TaskService } from '../services/task.service';
import { PoupService } from '../services/poup.service';


import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ContactService } from '../services/contact.service';
import { SubtaskService } from '../services/subtask.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

search:string = '';

taskListForSearch:Task[] = [];

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
    public subTaskService: SubtaskService,
    public contactService: ContactService,
    public popupService: PoupService,

  ) { 
    this.taskListForSearch = [...this.taskService.tasks];
  }

  // Drag & Drop
  drop(event: CdkDragDrop<any>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event, targetStatus);
      const transferredItem = event.previousContainer.data[event.previousIndex];
      transferredItem.status = targetStatus;
      
      this.taskService.updateTaskStatus(transferredItem, transferredItem.id)
      
      // Entfernen Sie das Element aus dem ursprünglichen Array
      event.previousContainer.data.splice(event.previousIndex, 1);

      // Sortieren Sie die Aufgaben erneut
      this.taskService.sortTasks();
    }
  }


  ngOnInit(): void {
    this.taskService.getTasks();
    this.subTaskService.getSubTasks();
    this.contactService.getContacts();

    this.contactService.myContacts$.subscribe( contacts => {
      this.contactService.contacts = contacts;
    });

    this.taskService.myTasks$.subscribe(() =>{
      this.taskListForSearch = this.taskService.tasks;
    });
  }


  addTaskPopup(status: string) {
    this.popupService.behindPopupContainer = true;
    this.popupService.addTaskPopup = true;
    this.taskService.status = status;
  }


  searchTask() {
    if (this.search.trim() === '') {
      this.taskService.tasks = [...this.taskListForSearch];
    } else {
      const filteredTasksTodo = this.taskListForSearch.filter(task => 
        task.title.toLowerCase().includes(this.search.toLowerCase())
      );
      this.taskService.tasks = filteredTasksTodo;
    }
    this.taskService.sortTasks();
  }

  checkSearchinput(){
    if (this.search == '') {
      this.taskService.tasks = this.taskListForSearch;
    }
  }

}
