import { Component, computed, effect, ElementRef, input, Input, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact, ContactService } from '../services/contact.service';
import { SubTask, SubtaskService } from '../services/subtask.service';
import { Task, TaskService } from '../services/task.service';
import { PoupService } from '../services/poup.service';
import { MatSnackBar } from '@angular/material/snack-bar';

type Headline = 'Add Task' | 'Edit Task';


@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss'],
  standalone: false
})
export class AddtaskComponent implements OnInit, OnDestroy {
  headline = input<Headline>('Add Task');

  readonly isInEditMode = computed(() => {
    return this.headline() === 'Edit Task';
  });

  private buttons = ['urgent', 'medium', 'low'];

  taskId: number | undefined;
  subtasksForView = signal<string[]>([]);

  subtasksForSubmit = computed(() => {
    const filters = this.subtasksForView(); 
    return this.subtaskService.subtasks()
      .filter(st => filters.some(filter => st.title === filter))
      .map(st => st.id); 
  });
  

  assigned_contacts: Contact[] = [];
  selected: string = '';
  minDate: string = this.getMinDate();


  public addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required, []),
    category: new FormControl('', Validators.required, []),
    date: new FormControl('', Validators.required, []),
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

  ngOnDestroy(): void {
    this.popupService.taskToEdit = null;
  }


  private fillForm() {
    const task = this.popupService.taskToEdit;
    this.addTaskForm.get('title')?.setValue(`${task?.title}`);
    this.addTaskForm.get('description')?.setValue(`${task?.description}`);
    this.fillContacts(task?.assigned_to || []);
    this.addTaskForm.get('date')?.setValue(`${task?.date}`);
    if (task) this.selectPrio(task.prio);
    this.addTaskForm.get('category')?.setValue(`${task?.category}`);
    this.subtasksForView.set(this.fillSubTasks(task?.subtasks || []));
  }

  private fillContacts(assigned_contacts: number[]) {
    assigned_contacts.forEach((id: number) => {
      this.addTaskForm.value.assigned_to.push(`${id}`);
    });
  }

  private fillSubTasks(subtasks: number[]) {
    if (!subtasks) return [];
    const st: string[] = [];

    subtasks.forEach((id: number) => {
      let index = this.subtaskService.subtasks().findIndex((task: SubTask) => task.id === id);
      if (index !== -1) {
        st.push(this.subtaskService.subtasks()[index].title);
      }
    });
    return st;
  }


  protected onSubmit() {
    if (!this.addTaskForm.valid && !this.isInEditMode()) {
      this.snackBarMessage('Please fill the form!');
      return;
    }
    this.updateOrAddTask();
    this.resetSubtaskandForm();
  }

  private updateOrAddTask() {
    this.addTaskForm.value.subtask = this.subtasksForSubmit();
    if (this.isInEditMode() && this.taskId) {
      this.taskService.updateTask(this.addTaskForm, this.taskId);
    } else {
      this.taskService.addTask(this.addTaskForm);
    }
  }

  private resetSubtaskandForm() {
    this.resetForm();
    this.popupService.closePopups();
    this.subtasksForView.set([]);
  }

  private snackBarMessage(msg: string) {
    this.snackBar.open(msg, 'close', {
      duration: 3000,
      panelClass: ['blue-snackbar']
    });
  }

  protected resetForm() {
    this.addTaskForm.reset({
      title: '',
      category: '',
      date: '',
      description: '',
      subtask: [],
      assigned_to: [],
      prio: ''
    });

    this.assigned_contacts = [];
    this.resetButtons();
  }

  private getMinDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const minDate = `${year}-${month}-${day}`;

    return minDate;
  }

  protected removeSubTask(i: number) {
    const arrayToUpdate = this.subtasksForView();
    arrayToUpdate.splice(i, 1);
    this.subtasksForView.set(arrayToUpdate);
  }

  protected selectPrio(prio: string) {
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
    }
  }

  private resetButtons() {
    this.buttons.forEach(button => {
      const element = this.el.nativeElement.querySelector(`#${button}`);
      element.classList.remove(button);
    });
  }

  addNewSubtask() {
    const subTaskValue: string = this.addTaskForm.value.subtask;
    if (this.subtaskIsAlreadyDisplayed(subTaskValue)) return;

    const existingSubtask = this.subtaskService.subtasks().find(st => st.title.toLowerCase() === subTaskValue.toLowerCase());

    if (existingSubtask) {
      this.pushToSubtaskForView(existingSubtask.title);
    } else {
      this.pushToSubtaskForView(subTaskValue);
      this.subtaskService.addSubTask(subTaskValue);
    }

    this.emptySuptaskInputField();
  }

  private pushToSubtaskForView(subtask:string){
    const arrayToUpdate = this.subtasksForView();
    arrayToUpdate.push(subtask);
    this.subtasksForView.set(arrayToUpdate);
  }

  private subtaskIsAlreadyDisplayed(value: string): boolean {
    return this.subtasksForView().some(st => st === value);
  }

  private emptySuptaskInputField() {
    this.addTaskForm.get('subtask')?.setValue('');
  }


  deleteTask(id: number) {
    this.taskService.deleteTask(id);
    this.popupService.closePopups();
  }


  changeTaskStatus(task: Task) {
    this.taskId = task.id;
    this.onSubmit();
    this.popupService.closePopups();
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
}
