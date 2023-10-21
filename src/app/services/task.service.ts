import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Task {
  id?: number;
  title: string;
  description?: string;
  assigned_to?: [];
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
      })
    );
  }


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


  addTask(form: FormGroup) {
    debugger
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
