import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  assigned_to?: [];
  status?: string;
  date: Date;
  prio: string;
  category: string;
  subtasks?: [];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor(
    private http: HttpClient,
  ) {
  }

  tasks: Task[] = [];
  myTasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  url = environment.baseUrl + '/tasks/';
  status: string | undefined = undefined;
  todo: any = [];
  inProgress: any = [];
  awaitingFeedback: any = [];
  done: any = [];


  /**
 * Retrieves tasks from the server and updates the local tasks array.
 */
  getTasks() {
    this.loadTasks().subscribe((data) => {
      this.tasks = data;
      this.myTasks$.next(data); // Update the BehaviorSubject with the latest data
    });
  }

  /**
  * Loads tasks from the server.
  * @returns An Observable that emits the tasks data.
  */
  private loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url).pipe(
      tap((data) => {
        this.tasks = data;
        this.myTasks$.next(data); // Update the BehaviorSubject with the latest data
        this.sortTasks(); // Sort the tasks after loading
      })
    );
  }

  /**
  * Sorts the tasks into different status categories.
  */
  sortTasks() {
    this.todo = [];
    this.inProgress = [];
    this.awaitingFeedback = [];
    this.done = [];

    this.tasks.forEach(task => {
      if (task.status === 'todo') {
        this.todo.push(task);
      } else if (task.status === 'inProgress') {
        this.inProgress.push(task);
      } else if (task.status === 'awaitingFeedback') {
        this.awaitingFeedback.push(task);
      } else if (task.status === 'done') {
        this.done.push(task);
      }
    });
  }


  /**
 * Updates an existing task with the provided form data.
 * @param form The FormGroup containing the updated task data.
 * @param id The ID of the task to be updated.
 */
  updateTask(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data: Task = {
      title: form.value.title,
      description: form.value.description,
      assigned_to: form.value.assigned_to,
      date: form.value.date,
      prio: form.value.prio,
      category: form.value.category,
      subtasks: form.value.subtask,
    };

    this.http.put(url, data).subscribe(() => {
      this.getTasks(); // Refresh the tasks after updating
    }, (error) => {
      console.error('Error updating task', error);
    });
  }


  /**
  * Updates the status of a task.
  * @param t The task object containing the updated status.
  * @param id The ID of the task to update.
  */
  updateTaskStatus(t: any, id: number) {
    const url = `${this.url}${id}/`;
    const data: Partial<Task> = {
      status: t.status
    };

    this.http.patch(url, data).subscribe(() => {
      this.myTasks$.next(this.tasks);
      this.sortTasks();
    }, (error) => {
      console.error('Error updating task status', error);
    });
  }


  /**
  * Adds a new task with the provided form data.
  * @param form The FormGroup containing the new task data.
  */
  addTask(form: FormGroup) {
    const status = this.checkForStatus();
    const data = {
      title: form.value.title,
      description: form.value.description,
      assigned_to: form.value.assigned_to,
      date: form.value.date,
      prio: form.value.prio,
      category: form.value.category,
      subtasks: form.value.subtask,
      status: status
    };

    this.http.post(this.url, data).subscribe((response: any) => {
      this.tasks.push(response);
      this.myTasks$.next(this.tasks);
      this.sortTasks();
      this.status = undefined;
    }, (error) => {
      console.error('Error adding task', error);
    });
  }


  /**
 * Checks if a status is defined and returns it; otherwise, returns 'todo'.
 * @returns The status string.
 */
  checkForStatus() {
    if (this.status) {
      return this.status;
    } else {
      return 'todo';
    }
  }

  
  /**
   * Deletes a task with the specified ID.
   * @param id The ID of the task to delete.
   */
  deleteTask(id: number) {
    const url = `${this.url}${id}/`;
    this.http.delete(url).subscribe(() => {
      this.getTasks(); // Refresh the tasks after deleting
    }, (error) => {
      console.error('Error deleting task', error);
    });
  }


}
