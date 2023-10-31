import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { TaskService } from '../services/task.service';
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

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
    public contactService: ContactService,
    public popupService: PoupService,

  ) { }

  // Drag & Drop
  drop(event: CdkDragDrop<any>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      
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
    this.templateService.board = true;
    this.taskService.getTasks();
  }


  ngOnDestroy(): void {
    this.templateService.board = false;

  }


  addTaskPopup(status: string) {
    this.popupService.behindPopupContainer = true;
    this.popupService.addTaskPopup = true;
  }

}
