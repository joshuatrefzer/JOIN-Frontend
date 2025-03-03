import { AfterViewInit, Component, computed, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { Task, TaskService } from '../services/task.service';
import { PoupService } from '../services/poup.service';
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ContactService } from '../services/contact.service';
import { SubtaskService } from '../services/subtask.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    standalone: false
})
export class BoardComponent implements OnInit, AfterViewInit {

  search: string = '';
  taskListForSearch: WritableSignal<Task[]> = signal([]);

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
    public subTaskService: SubtaskService,
    public contactService: ContactService,
    public popupService: PoupService,
  ) {}


  ngOnInit(): void {
    this.taskService.getTasks();
    this.subTaskService.getSubTasks();
    this.contactService.getContacts();    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.taskListForSearch.set(this.taskService.tasks());
    }, 500);
    console.log(this.taskService.tasks());
    
    
    
    
  }

  /**
 * Handles the dropping of an item within or between containers.
 * 
 * @param {CdkDragDrop<any>} event The drag-and-drop event object.
 * @param {string} targetStatus The target status for the dropped item.
 */
  drop(event: CdkDragDrop<any>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const transferredItem = event.previousContainer.data[event.previousIndex];
      transferredItem.status = targetStatus;

      this.taskService.updateTaskStatus(transferredItem, transferredItem.id);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }


  /**
 * Opens the add task popup and sets the task status.
 * 
 * @param {string} status The status of the task to be added.
 */
  addTaskPopup(status: string) {
    this.popupService.behindPopupContainer = true;
    this.popupService.addTaskPopup = true;
    this.taskService.status = status;
  }


  
  searchTask() {
    if (this.search.trim() === '') {
      debugger
      this.taskService.tasks.set(this.taskListForSearch());
      console.log(this.taskListForSearch());
      
    } else {
      const filteredTasksTodo = this.taskListForSearch().filter(task =>
        task.title.toLowerCase().includes(this.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.search.toLowerCase())
      );
      this.taskService.tasks.set(filteredTasksTodo);
    }
  }

}
