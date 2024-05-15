import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface SubTask {
  id?:number;
  title:string;
  done:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubtaskService {


  constructor(
    private http: HttpClient,
  ) {
  }

  subTasks: SubTask[] = [];
  mySubTasks$: BehaviorSubject<SubTask[]> = new BehaviorSubject<SubTask[]>([]);

  url = environment.baseUrl + '/subtasks/';


  getSubTasks() {
    this.loadSubTasks().subscribe((data: SubTask[]) => {
      this.subTasks = data;
      this.mySubTasks$.next(data);
    });
  }


  private loadSubTasks(): Observable<SubTask[]> {
    return this.http.get<SubTask[]>(this.url).pipe(
      tap((data: SubTask[]) => {
        this.subTasks = data;
        this.mySubTasks$.next(data);
      })
    );
  }


  subTaskExists(title:string) {
    return this.subTasks.some(subtask => subtask.title === title);
  }


  updateSubTask(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data: SubTask = {
      title: form.value.title,
      done: form.value.done,
    };

    this.http.put(url, data).subscribe(() => {
      // Hier können Sie die aktualisierten Taskinfos verwenden, wenn Sie sie benötigen
      const updatedIndex = this.subTasks.findIndex(subtask => subtask.id === id);
      if (updatedIndex !== -1) {
        this.subTasks[updatedIndex] = { id, ...data };
      }
      this.mySubTasks$.next(this.subTasks); // Aktualisieren Sie das BehaviorSubject mit den neuesten Daten
    }, (error) => {
      console.error('Fehler bei der Aktualisierung des Kontakts', error);
    });
  }



  ////FUNKTIONIERT NOCH NICHT 
  updateSubtaskCheckbox(id:number, st:SubTask){
    debugger
    const url = `${this.url}${id}/`;
    const data: Partial<SubTask> = {
      done: st.done,
    };
    this.http.patch(url, data).subscribe(() => {
      this.mySubTasks$.next(this.subTasks);
      console.log(this.subTasks);
      
    }, (error) => {
      console.error('Fehler bei der Aktualisierung des SubTasks', error);
    });



  }



  addSubTask(title:string) {
    const data:SubTask = {
      title: title,
      done: false
    };

    this.http.post(this.url, data).subscribe((response: any) => {
      // Hier können Sie die neu hinzugefügten Infos verwenden, wenn Sie sie benötigen
      this.subTasks.push(response);
      this.mySubTasks$.next(this.subTasks); // Aktualisieren Sie das BehaviorSubject mit den neuesten Daten
    }, (error) => {
      console.error('Contact was not added', error);
    });
  }



  deleteSubTask(id: number) {
    const url = `${this.url}${id}/`;
    this.http.delete(url).subscribe(() => {
      // Hier können Sie den gelöschten Task entfernen, wenn Sie dies benötigen
      this.subTasks = this.subTasks.filter(subtask => subtask.id !== id);
      this.mySubTasks$.next(this.subTasks); // Aktualisieren Sie das BehaviorSubject mit den neuesten Daten
    }, (error) => {
      console.error('Fehler beim Löschen des Tasks', error);
    });
  }

}
