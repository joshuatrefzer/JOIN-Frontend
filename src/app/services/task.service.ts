import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, lastValueFrom, Observable, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Task {
  id: number;
  title: string;
  description?: string;
  assigned_to?: [];
  status?: string;
  date: Date;
  prio: string;
  category: string;
  subtasks?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor(private http: HttpClient) { }

  tasks: WritableSignal<Task[]> = signal([]);
  tasksBackupForSearch: WritableSignal<Task[]> = signal([]);

  todoTasks = computed(() => {
    return this.tasks().filter(t => t.status === 'todo');
  });

  inProgressTasks = computed(() => {
    return this.tasks().filter(t => t.status === 'inProgress');
  });

  awaitingFeedbackTasks = computed(() => {
    return this.tasks().filter(t => t.status === 'awaitingFeedback');
  });

  doneTasks = computed(() => {
    return this.tasks().filter(t => t.status === 'done');
  });

  url = environment.baseUrl + '/tasks/';
  status: string | undefined;

  todo: Task[] = [];
  inProgress: Task[] = [];
  awaitingFeedback: Task[] = [];
  done: Task[] = [];


  async getTasks() {
    try {
      const data = await lastValueFrom(
        this.loadTasks().pipe(
          catchError(error => {
            console.error('Error loading tasks', error);
            throw error;
          })
        )
      );

      this.tasks.set(data);
      this.tasksBackupForSearch.set(data);

    } catch (error) {
      console.error('Failed to get tasks:', error);
    }
  }

  private loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }


  async updateTask(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data: Task = {
      id: id,
      title: form.value.title,
      description: form.value.description,
      assigned_to: form.value.assigned_to,
      date: form.value.date,
      prio: form.value.prio,
      category: form.value.category,
      subtasks: form.value.subtask,
    };

    try {
      const updatedTask = await lastValueFrom(
        this.http.put<Task>(url, data).pipe(
          catchError(error => {
            console.error('Error updating the task', error);
            throw error;
          })
        )
      );

      if (updatedTask) {
        const updatedTasks = this.tasks().map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
        this.tasks.set(updatedTasks);
      }

    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async updateTaskStatus(task: Task, id: number) {
    this.refreshFilteredTasks();

    const url = `${this.url}${id}/`;
    const data: Partial<Task> = {
      status: task.status,
    };

    try {
      await lastValueFrom(
        this.http.patch(url, data).pipe(
          catchError(error => {
            console.error('Error updating task status', error);
            throw error;
          })
        )
      );

    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }

  private refreshFilteredTasks() {
    const refresher: Task[] = this.tasks();
    this.tasks.update(items => [...refresher]);
  }

  async addTask(form: FormGroup) {
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

    try {
      const response = await lastValueFrom(
        this.http.post<Task>(this.url, data).pipe(
          catchError(error => {
            console.error('Error adding task', error);
            throw error;
          })
        )
      );

      const tasksUpdate = [...this.tasks(), response];
      this.tasks.set(tasksUpdate);

    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }

  private checkForStatus() {
    if (this.status) {
      return this.status;
    } else {
      return 'todo';
    }
  }

  async deleteTask(id: number) {
    const url = `${this.url}${id}/`;

    try {
      await lastValueFrom(
        this.http.delete(url).pipe(
          catchError(error => {
            console.error('Error deleting task', error);
            throw error;
          })
        )
      );
      this.getTasks();

    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }
}
