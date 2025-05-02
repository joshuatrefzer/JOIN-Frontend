import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, lastValueFrom, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface SubTask {
  id: number;
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

  async getSubTasks() {
    try {
      const data = await lastValueFrom(
        this.loadSubTasks().pipe(
          catchError(error => {
            console.error('Error loading subtasks', error);
            throw error;
          })
        )
      );
  
      this.subtasks.set(data);
  
    } catch (error) {
      console.error('Failed to get subtasks:', error);
    }
  }
  
  private loadSubTasks(): Observable<SubTask[]> {
    return this.http.get<SubTask[]>(this.url);
  }

  async updateSubTask(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data: SubTask = {
      id: id,
      title: form.value.title,
      done: form.value.done,
    };
  
    try {
      await lastValueFrom(
        this.http.put(url, data).pipe(
          catchError(error => {
            console.error('Error updating the subtask', error);
            throw error;
          })
        )
      );
  
      const updatedIndex = this.subtasks().findIndex(subtask => subtask.id === id);
      if (updatedIndex !== -1) {
        const updatedSubtasks = [...this.subtasks()];
        updatedSubtasks[updatedIndex] = { ...data };
        this.subtasks.set(updatedSubtasks);
      }
  
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  }

  async updateSubtaskCheckbox(id: number, st: SubTask) {
    const url = `${this.url}${id}/`;
    const data: Partial<SubTask> = { done: st.done };
  
    try {
      const updatedSubtask = await lastValueFrom(
        this.http.patch<SubTask>(url, data).pipe(
          catchError(error => {
            console.error('Error updating the subtask', error);
            throw error;
          })
        )
      );
  
      if (updatedSubtask) {
        const updatedSubtasks = this.subtasks().map(subtask =>
          subtask.id === updatedSubtask.id ? updatedSubtask : subtask
        );
        this.subtasks.set(updatedSubtasks);
      }
  
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  }

  async addSubTask(title: string) {
    const data: Partial<SubTask> = {
      title: title,
      done: false
    };
  
    try {
      const response = await lastValueFrom(
        this.http.post<SubTask>(this.url, data).pipe(
          catchError(error => {
            console.error('Subtask was not added', error);
            throw error;
          })
        )
      );
  
      this.subtasks.set([...this.subtasks(), response]);
  
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }

  async deleteSubTask(id: number) {
    const url = `${this.url}${id}/`;
  
    try {
      await lastValueFrom(
        this.http.delete(url).pipe(
          catchError(error => {
            console.error('Error deleting the subtask', error);
            throw error;
          })
        )
      );
  
      const updatedSubtasks: SubTask[] = this.subtasks().filter(subtask => subtask.id !== id);
      this.subtasks.set(updatedSubtasks);
  
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }

}
