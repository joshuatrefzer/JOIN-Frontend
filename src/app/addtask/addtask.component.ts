import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact, ContactService } from '../services/contact.service';
import { SubTask, SubtaskService } from '../services/subtask.service';
import { Task, TaskService } from '../services/task.service';
import { PoupService } from '../services/poup.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-addtask',
    templateUrl: './addtask.component.html',
    styleUrls: ['./addtask.component.scss'],
    standalone: false
})
export class AddtaskComponent implements OnInit, OnDestroy {
  @Input() headline: 'Add Task' | 'Edit Task' = 'Add Task';


  buttons = ['urgent', 'medium', 'low'];
  taskId: number | undefined;
  subtasksforView: any = [];
  subtasksForSubmit: any = []

  assigned_contacts: any = [];
  selected: string = '';
  minDate: string = this.getMinDate();


  public addTaskForm: FormGroup = new FormGroup({

    title: new FormControl('', [
      Validators.required,
    ], []),

    category: new FormControl('', [
      Validators.required,
    ], []),

    date: new FormControl('', [
      Validators.required], []),

    description: new FormControl(''),
    assigned_to: new FormControl(''),
    subtask: new FormControl(''),
    prio: new FormControl(''),
  });


  constructor(
    public templateService: TemplateService,
    public contactService: ContactService,
    public popupService: PoupService,
    public subtaskService: SubtaskService,
    public taskService: TaskService,
    private renderer: Renderer2, private el: ElementRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.resetForm();
    this.popupService.editTaskPopup ? this.fillForm() : null;
  }

  getMinDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const minDate = `${year}-${month}-${day}`;

    return minDate;
  }


  ngOnDestroy(): void {
    this.popupService.taskToEdit = null;
  }


  /**
  * Filter function to determine whether a given date is greater than or equal to today's date.
  * 
  * @param {Date | null} d The date to be checked. If null, today's date is used.
  * @returns {boolean} True if the given date is greater than or equal to today's date, false otherwise.
  */
  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    d = d || today;
    return d >= today;
  };


  /**
  * Fills the form fields with the details of the task to be edited.
  */
  fillForm() {
    const task = this.popupService.taskToEdit; 
    this.addTaskForm.get('title')?.setValue(`${task?.title}`);
    this.addTaskForm.get('description')?.setValue(`${task?.description}`);
    this.fillContacts(task?.assigned_to);
    this.addTaskForm.get('date')?.setValue(`${task?.date}`);
    if (task) this.selectPrio(task.prio);
    this.addTaskForm.get('category')?.setValue(`${task?.category}`);
    this.subtasksforView = this.fillSubTasks(task?.subtasks);
  }


  /**
 * Fills the assigned_to field in the form with the given array of assigned contacts.
 * 
 * @param {any[]} assigned_contacts An array containing the IDs of assigned contacts.
 */
  fillContacts(assigned_contacts: any) {
    assigned_contacts.forEach((id: number) => {
      this.addTaskForm.value.assigned_to.push(`${id}`);
    });
  }

  /**
  * Fills an array with subtasks based on the given array of subtask IDs.
  * 
  * @param {any[]} subtasks An array containing the IDs of subtasks.
  * @returns {SubTask[]} An array of SubTask objects corresponding to the given subtask IDs.
  */
  fillSubTasks(subtasks: any) {
    const st: SubTask[] = [];
    subtasks.forEach((id: number) => {
      let index = this.subtaskService.subtasks().findIndex((task: SubTask) => task.id === id);
      if (index !== -1) {
        st.push(this.subtaskService.subtasks()[index]);
      }
    });
    return st;
  }


  onSubmit() {
    if (!this.addTaskForm.valid && this.headline == "Add Task") {
      this.snackBarMessage('Please fill the form!');
      return;
    }
    this.prepareSubtaskForRequest();
    this.updateOrAddTask();
    this.resetSubtaskandForm();
  }

  /**
  * Determines whether to update or add the task and invokes the corresponding service method.
  * 
  * Updates the subtask value in the form, then calls either the task update or task add service method based on the headline and task ID.
  */
  updateOrAddTask() {
    this.addTaskForm.value.subtask = this.subtasksForSubmit;
    if (this.headline !== "Add Task" && this.taskId) {
      this.taskService.updateTask(this.addTaskForm, this.taskId);
    } else {
      this.taskService.addTask(this.addTaskForm);
    }
  }

  prepareSubtaskForRequest() {
    if (this.subtasksforView.length >= 1) {
      for (const subtask of this.subtasksforView) {
        this.subtasksForSubmit.push(`${subtask.id}`);
      }
    }
  }

  resetSubtaskandForm() {
    alert("Refactoren");
    this.resetForm();
    this.popupService.closePopups();
    this.subtasksforView = [];
    this.subtasksForSubmit = [];
  }

  
  snackBarMessage(msg: string) {
    this.snackBar.open(msg, 'close', {
      duration: 3000,
      panelClass: ['blue-snackbar']
    });
  }

  /**
  * Checks for the 'Enter' key press event and adds a new subtask if detected.
  * 
  * @param {KeyboardEvent} event The keyboard event object.
  */
  checkForKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addNewSubtask();
    }
  }

  resetForm() {
    this.addTaskForm.reset({
      title: '',
      category: '',
      date: '',
      description: '',
      subtask: [],
      assigned_to: [],
      prio: ''
    });

    this.resetSubTaskForView();
    this.assigned_contacts = [];
    this.resetButtons();
  }

  resetSubTaskForView() {
    this.subtasksforView.forEach((st: { id: number; }) => {
      this.subtaskService.deleteSubTask(st.id);
    });
    this.subtasksforView = [];
  }

  removeSubTask(i: number, task: any) {
    this.subtasksforView.splice(i, 1);
  }



  /**
 * Selects the priority for the task and updates the form accordingly.
 * 
 * @param {string} prio The priority value to be selected.
 */
  selectPrio(prio: string) {
    const selectedElement = this.el.nativeElement.querySelector(`#${prio}`);
    if (this.buttons.includes(prio)) {
      if (selectedElement.classList.contains(prio)) {
        selectedElement.classList.remove(prio);
        this.addTaskForm.get('prio')?.setValue('');
      } else {
        this.resetButtons();
        selectedElement.classList.add(prio);
        this.addTaskForm.get('prio')?.setValue(`${prio}`);
      }
    } else {
      this.snackBarMessage('Invalid priority selected');
    }
  }

  /**
  * Resets the priority buttons by removing their selected state.
  */
  resetButtons() {
    this.buttons.forEach(button => {
      const element = this.el.nativeElement.querySelector(`#${button}`);
      element.classList.remove(button);
    });
  }

  addNewSubtask() {
    const SubTaskValue = this.addTaskForm.value.subtask;
    this.addTaskForm.get('subtask')?.setValue('');
    this.subtaskService.addSubTask(SubTaskValue);


    // this.subtaskService.subtasks().subscribe(() => {
    //   const existingSubtask = this.subtaskService.subTasks.find(subtask => subtask.title === SubTaskValue);

    //   if (existingSubtask && existingSubtask.id !== undefined) {
    //     const isAlreadyAdded = this.subtasksforView.some((subtask: { id: number }) => subtask.id === existingSubtask.id);
    //     if (!isAlreadyAdded) {
    //       this.subtasksforView.push(existingSubtask);
    //     }
    //   }
    // });
  }

  /**
  * Deletes a task with the specified ID.
  * 
  * @param {any} id The ID of the task to be deleted.
  */
  deleteTask(id: any) {
    this.taskService.deleteTask(id);
    this.popupService.closePopups();
  }

  /**
  * Changes the task with the specified task object.
  * 
  * @param {any} task The task object to be changed.
  */
  changeTask(task: any) {
    this.taskId = task.id;
    this.onSubmit();
    this.popupService.closePopups();
  }
}
