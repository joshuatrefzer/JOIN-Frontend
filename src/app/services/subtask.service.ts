import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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


  constructor(
    private http: HttpClient,
  ) {
  }

  subTasks: SubTask[] = [];
  mySubTasks$: BehaviorSubject<SubTask[]> = new BehaviorSubject<SubTask[]>([]);
  url = environment.baseUrl + '/subtasks/';


  /**
  * Retrieves subtasks from the server and updates the local subtask list.
  */
  getSubTasks() {
    this.loadSubTasks().subscribe((data: SubTask[]) => {
      this.subTasks = data;
      this.mySubTasks$.next(data);
    });
  }

  /**
  * Loads subtasks from the server.
  * @returns An observable emitting an array of subtasks.
  */
  private loadSubTasks(): Observable<SubTask[]> {
    return this.http.get<SubTask[]>(this.url).pipe(
      tap((data: SubTask[]) => {
        this.subTasks = data;
        this.mySubTasks$.next(data);
      })
    );
  }

  /**
  * Checks if a subtask with the given title exists in the local subtask list.
  * @param title - The title of the subtask to check.
  * @returns A boolean indicating whether a subtask with the given title exists.
  */
  subTaskExists(title: string): boolean {
    return this.subTasks.some(subtask => subtask.title === title);
  }


  /**
 * Updates a subtask on the server.
 * @param form - The form containing the updated subtask information.
 * @param id - The ID of the subtask to update.
 */
  updateSubTask(form: FormGroup, id: number) {
    const url = `${this.url}${id}/`;
    const data: SubTask = {
      title: form.value.title,
      done: form.value.done,
    };

    this.http.put(url, data).subscribe(() => {
      // Here you can use the updated task information if needed
      const updatedIndex = this.subTasks.findIndex(subtask => subtask.id === id);
      if (updatedIndex !== -1) {
        this.subTasks[updatedIndex] = { id, ...data };
      }
      this.mySubTasks$.next(this.subTasks); // Update the BehaviorSubject with the latest data
    }, (error) => {
      console.error('Error updating the subtask', error);
    });
  }


  /**
 * Updates the checkbox status of a subtask on the server.
 * @param id - The ID of the subtask to update.
 * @param st - The subtask object containing the updated checkbox status.
 */
  updateSubtaskCheckbox(id: number, st: SubTask) {
    const url = `${this.url}${id}/`;
    const data: Partial<SubTask> = {
      done: st.done,
    };
    this.http.patch(url, data).subscribe(() => {
      this.mySubTasks$.next(this.subTasks);
      console.log(this.subTasks);
    }, (error) => {
      console.error('Error updating the subtask', error);
    });
  }


  /**
  * Adds a new subtask to the server.
  * @param title - The title of the new subtask.
  */
  addSubTask(title: string) {
    const data: SubTask = {
      title: title,
      done: false
    };
    this.http.post(this.url, data).subscribe((response: any) => {
      this.subTasks.push(response);
      this.mySubTasks$.next(this.subTasks);
    }, (error) => {
      console.error('Subtask was not added', error);
    });
  }


  /**
  * Deletes a subtask from the server.
  * @param id - The ID of the subtask to delete.
  */
  deleteSubTask(id: number) {
    const url = `${this.url}${id}/`;
    this.http.delete(url).subscribe(() => {
      this.subTasks = this.subTasks.filter(subtask => subtask.id !== id);
      this.mySubTasks$.next(this.subTasks);
    }, (error) => {
      console.error('Error deleting the subtask', error);
    });
  }

}
