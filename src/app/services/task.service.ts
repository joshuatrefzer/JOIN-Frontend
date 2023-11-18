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


  todo: any = [];
  inProgress: any = [];
  awaitingFeedback: any = [];
  done: any = [];


  getTasks() {
    this.loadTasks().subscribe((data) => {
      this.tasks = data;
      this.myTasks$.next(data);
    });
  }


  private loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url).pipe(
      tap((data) => {
        this.tasks = data;
        this.myTasks$.next(data);
        console.log(this.tasks);
        this.sortTasks();
      })
    );
  }

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


  updateTask(task: any, id: number) {
    debugger
    const url = `${this.url}${id}/`;
    const data: Task = {
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to,
      date: task.date,
      prio: task.prio,
      category: task.category,
      subtasks: task.subtask,
    };

    this.http.put(url, data).subscribe(() => {
      this.getTasks();
    }, (error) => {
      console.error('Fehler bei der Aktualisierung des Tasks', error);
    });
  }

  

  updateTaskStatus(t: any, id: number) {
    const url = `${this.url}${id}/`;
    const data: Partial<Task> = {
      status: t.status
    };

    this.http.patch(url, data).subscribe(() => {
      this.myTasks$.next(this.tasks);
    }, (error) => {
      console.error('Fehler bei der Aktualisierung des Tasks', error);
    });
  }


  addTask(form: FormGroup) {
    const data = {
      title: form.value.title,
      description: form.value.description,
      assigned_to: form.value.assigned_to,
      date: form.value.date,
      prio: form.value.prio,
      category: form.value.category,
      subtasks: form.value.subtask,
    };

    this.http.post(this.url, data).subscribe((response: any) => {
      // Hier können Sie die neu hinzugefügten Kontaktinformationen verwenden, wenn Sie sie benötigen
      this.tasks.push(response);
      this.myTasks$.next(this.tasks);
      console.log(this.tasks);

    }, (error) => {
      console.error('Contact was not added', error);
    });
  }


  deleteTask(id: number) {
    const url = `${this.url}${id}/`;
    this.http.delete(url).subscribe(() => {
      this.getTasks();
    }, (error) => {
      console.error('Fehler beim Löschen des Tasks', error);
    });
  }




}
