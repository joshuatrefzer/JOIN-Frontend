import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
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


  constructor(private http: HttpClient) {}

  tasks: WritableSignal<Task[]> = signal([]);
  tasksBackupForSearch: WritableSignal<Task[]>  = signal([]);

  todoTasks = computed(() => {
    return this.tasks().filter( t => t.status === 'todo');
  });

  inProgressTasks = computed(() => {
    return this.tasks().filter( t => t.status === 'inProgress');
  });

  awaitingFeedbackTasks = computed(() => {
    return this.tasks().filter( t => t.status === 'awaitingFeedback');
  });

  doneTasks = computed(() => {
    return this.tasks().filter( t => t.status === 'done');
  });

  url = environment.baseUrl + '/tasks/';
  status: string | undefined = undefined;
  
  todo: any = [];
  inProgress: any = [];
  awaitingFeedback: any = [];
  done: any = [];


  public getTasks() {
    this.loadTasks().subscribe((data) => {
      this.tasks.set(data);
    });
  }

  private loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url).pipe(
      tap((data) => {
        this.tasks.set(data);
        this.tasksBackupForSearch.set(data);
      })
    );
  }


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

  updateTaskStatus(task: Task, id: number) {
    this.refreshFilteredTasks();

    const url = `${this.url}${id}/`;
    const data: Partial<Task> = {
      status: task.status
    };

    this.http.patch(url, data).subscribe(() => {


    }, (error) => {
      console.error('Error updating task status', error);
    });
  }

  private refreshFilteredTasks() {
    const refresher: Task[] = this.tasks();
    this.tasks.update(items => [...refresher]);
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

    this.http.post<Task[]>(this.url, data).subscribe(response => {
      this.tasks.set(response);
      alert(response); //CHECKEN!!
      
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
      this.getTasks();
    }, (error) => {
      console.error('Error deleting task', error);
    });
  }


}
