import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface SubTask {
  id?: number;
  title: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubtaskService {

  subtasks: WritableSignal<SubTask[]> = signal([]);
  url = environment.baseUrl + '/subtasks/';

  constructor(private http: HttpClient) {}

  getSubTasks() {
    this.loadSubTasks().subscribe((data: SubTask[]) => {
      this.subtasks.set(data);
    });
  }

  private loadSubTasks(): Observable<SubTask[]> {
    return this.http.get<SubTask[]>(this.url);
  }

  updateSubTask(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data: SubTask = {
      title: form.value.title,
      done: form.value.done,
    };

    this.http.put(url, data).subscribe(() => {
      const updatedIndex = this.subtasks().findIndex(subtask => subtask.id === id);
      if (updatedIndex !== -1) {
        this.subtasks()[updatedIndex] = { id, ...data };
      }
    }, (error) => {
      console.error('Error updating the subtask', error);
    });
  }

  updateSubtaskCheckbox(id: number, st: SubTask) {
    const url = `${this.url}${id}/`;
    const data: Partial<SubTask> = {
      done: st.done,
    };
    this.http.patch(url, data).pipe(take(1)).subscribe(data => {
      
    }, (error) => {
      console.error('Error updating the subtask', error);
    });
  }

  addSubTask(title: string) {
    const data: SubTask = {
      title: title,
      done: false
    };
    this.http.post(this.url, data).subscribe((response: any) => {
      const update = this.subtasks();
      update.push(response);
      this.subtasks.set(update);
    }, (error) => {
      console.error('Subtask was not added', error);
    });
  }

  deleteSubTask(id: number) {
    const url = `${this.url}${id}/`;

    this.http.delete(url).pipe(take(1)).subscribe(() => {
      const update: SubTask[] = this.subtasks().filter(subtask => subtask.id !== id);
      this.subtasks.set(update);
    }, (error) => {
      console.error('Error deleting the subtask', error);
    });
  }

}
