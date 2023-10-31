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
  status?:string;
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
  

  todo:any = [];
  inProgress:any = [];
  awaitingFeedback:any = [];
  done:any = [];


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


  // Funktion so umschreiben, dass man auch als normales Objekt die Funktion benutzen kann.(Über Parameter)
  updateTask(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data: Task = {
      title: form.value.title,
      date: form.value.date,
      prio: form.value.prio,
      category: form.value.category,
    };

    this.http.put(url, data).subscribe(() => {
      // Hier können Sie die aktualisierten Taskinfos verwenden, wenn Sie sie benötigen
      const updatedIndex = this.tasks.findIndex(task => task.id === id);
      if (updatedIndex !== -1) {
        this.tasks[updatedIndex] = { id, ...data };
      }
      this.myTasks$.next(this.tasks); // Aktualisieren Sie das BehaviorSubject mit den neuesten Daten
    }, (error) => {
      console.error('Fehler bei der Aktualisierung des Kontakts', error);
    });
  }

  updateTaskStatus(t: any, id: number) {
    const url = `${this.url}${id}/`;
    const data: Task = {
      title: t.title,
      date: t.date,
      prio: t.prio,
      category: t.category,
      status:t.status
    };

    this.http.patch(url, data).subscribe(() => {
      // Hier können Sie die aktualisierten Taskinfos verwenden, wenn Sie sie benötigen
      const updatedIndex = this.tasks.findIndex(task => task.id === id);
      if (updatedIndex !== -1) {
        this.tasks[updatedIndex] = { status, ...data };
      }
      this.myTasks$.next(this.tasks); // Aktualisieren Sie das BehaviorSubject mit den neuesten Daten
    }, (error) => {
      console.error('Fehler bei der Aktualisierung des Kontakts', error);
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



  deleteContact(id: number) {
    const url = `${this.url}${id}/`;
    this.http.delete(url).subscribe(() => {
      // Hier können Sie den gelöschten Task entfernen, wenn Sie dies benötigen
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.myTasks$.next(this.tasks); // Aktualisieren Sie das BehaviorSubject mit den neuesten Daten
    }, (error) => {
      console.error('Fehler beim Löschen des Tasks', error);
    });
  }




}
