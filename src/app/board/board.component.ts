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

  search: string = '';

  taskListForSearch: Task[] = [];

  constructor(
    public templateService: TemplateService,
    public taskService: TaskService,
    public subTaskService: SubtaskService,
    public contactService: ContactService,
    public popupService: PoupService,

  ) {
    this.taskListForSearch = [...this.taskService.tasks];
  }



  /**
  * Initializes the component by fetching tasks, subtasks, and contacts from respective services.
  * 
  * Subscribes to observables for contacts and tasks to update local data when changes occur.
  */
  ngOnInit(): void {
    // Fetch tasks, subtasks, and contacts
    this.taskService.getTasks();
    this.subTaskService.getSubTasks();
    this.contactService.getContacts();

    // Subscribe to contacts observable to update local data
    this.contactService.myContacts$.subscribe(contacts => {
      this.contactService.contacts = contacts;
    });

    // Subscribe to tasks observable to update local data and search list
    this.taskService.myTasks$.subscribe(() => {
      this.taskListForSearch = this.taskService.tasks;
    });
  }


  /**
 * Handles the dropping of an item within or between containers.
 * 
 * @param {CdkDragDrop<any>} event The drag-and-drop event object.
 * @param {string} targetStatus The target status for the dropped item.
 */
  drop(event: CdkDragDrop<any>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      // If item is dropped within the same container, move it within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // If item is dropped into a different container, update its status and move it to the new container
      const transferredItem = event.previousContainer.data[event.previousIndex];
      transferredItem.status = targetStatus;

      // Update the task status in the database
      this.taskService.updateTaskStatus(transferredItem, transferredItem.id);

      // Remove the item from the original array
      event.previousContainer.data.splice(event.previousIndex, 1);

      // Sort the tasks again
      this.taskService.sortTasks();
    }
  }


  /**
 * Opens the add task popup and sets the task status.
 * 
 * @param {string} status The status of the task to be added.
 */
  addTaskPopup(status: string) {
    // Set behindPopupContainer to true to disable background scrolling
    this.popupService.behindPopupContainer = true;

    // Open the add task popup
    this.popupService.addTaskPopup = true;

    // Set the task status
    this.taskService.status = status;
  }


  /**
  * Searches for tasks based on the entered search query.
  * 
  * If the search query is empty, restores the original task list.
  * If not, filters the task list based on the search query and updates the task list.
  * Finally, sorts the task list.
  */
  searchTask() {
    if (this.search.trim() === '') {
      // If search query is empty, restore the original task list
      this.taskService.tasks = [...this.taskListForSearch];
    } else {
      // If search query is not empty, filter the task list based on the search query
      const filteredTasksTodo = this.taskListForSearch.filter(task =>
        task.title.toLowerCase().includes(this.search.toLowerCase())
      );
      // Update the task list with filtered tasks
      this.taskService.tasks = filteredTasksTodo;
    }
    // Sort the task list
    this.taskService.sortTasks();
  }


  /**
  * Checks if the search input is empty and restores the original task list if it is.
  */
  checkSearchinput() {
    if (this.search == '') {
      // If search input is empty, restore the original task list
      this.taskService.tasks = this.taskListForSearch;
    }
  }

}
