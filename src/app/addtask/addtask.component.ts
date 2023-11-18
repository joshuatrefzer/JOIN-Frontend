import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact, ContactService } from '../services/contact.service';
import { SubTask, SubtaskService } from '../services/subtask.service';
import { Task, TaskService } from '../services/task.service';
import { PoupService } from '../services/poup.service';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit, OnDestroy {
  @Input() headline: string = 'Add Task';

  buttons = ['urgent', 'medium', 'low'];


  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    d = d || today;
    return d >= today;
  };

  subtasksforView: any = [];
  subtasksForSubmit: any = []

  assigned_contacts: any = [];
  selected: string = '';

  public addTaskForm: FormGroup = new FormGroup({

    title: new FormControl('', [
      Validators.required,
    ], []),

    category: new FormControl('', [
      Validators.required,
    ], []),

    date: new FormControl('', [
      Validators.required,
    ], []),

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
    private renderer: Renderer2, private el: ElementRef
  ) { }


  ngOnInit(): void {
    this.resetForm();
    if (!this.popupService.addTaskPopup) this.templateService.addTask = true;
    this.popupService.editTaskPopup ? this.fillForm() : null;
    this.contactService.getContacts();
    this.subtaskService.getSubTasks();
  }



  ngOnDestroy(): void {
    this.templateService.addTask = false;
  }




  fillForm() {
    const task = this.popupService.taskToEdit;

    this.addTaskForm.get('title')?.setValue(`${task?.title}`);
    this.addTaskForm.get('description')?.setValue(`${task?.description}`);
    this.fillContacts(task?.assigned_to);
    this.addTaskForm.get('date')?.setValue(`${task?.date}`);
    if (task) this.selectPrio(task.prio);
    this.addTaskForm.get('category')?.setValue(`${task?.category}`);
    this.subtasksforView = this.fillSubTasks(task?.subtasks);
    console.log('taskform', this.addTaskForm, 'task:', task);
  }


  fillContacts(assigned_contacts: any) {
    let contacts: any = [];
    assigned_contacts.forEach((id: number) => {
      this.addTaskForm.value.assigned_to.push(`${id}`);
    })
  }


  fillSubTasks(subtasks: any) {
    const st: SubTask[] = [];
    subtasks.forEach((id: number) => {
      let index = this.subtaskService.subTasks.findIndex((task: SubTask) => task.id === id);
      if (index !== -1) {
        st.push(this.subtaskService.subTasks[index]);
      }
    })
    return st;
  }


  onSubmit(id: any) {
    if (!this.addTaskForm.valid) {
      console.log('Fülle die Form aus');
      return;
    }
    if (id == 0) this.addTaskForm.value.date = this.addTaskForm.value.date.toISOString().split('T')[0];
    if (this.subtasksforView.length >= 1) {
      for (const subtask of this.subtasksforView) {
        this.subtasksForSubmit.push(`${subtask.id}`);
      }
    }
    this.addTaskForm.value.subtask = this.subtasksForSubmit;
    if (id !== 0) this.taskService.updateTask(this.addTaskForm.value, id);
    if (id == 0) this.taskService.addTask(this.addTaskForm);

    this.taskService.myTasks$.subscribe(() => {
      this.subtasksForSubmit = [];
      this.subtasksforView = [];
      this.resetForm();
    });
  }


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


  assigneContact() {
    console.log(this.addTaskForm.value.assigned_to);

  }

  removeSubTask(i: number, task: any) {
    // this.subtaskService.deleteSubTask(task.id)
    this.subtasksforView.splice(i, 1);
  }



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
      console.error('Ungültige Prio ausgewählt');
    }
  }


  resetButtons() {
    this.buttons.forEach(button => {
      const element = this.el.nativeElement.querySelector(`#${button}`);
      element.classList.remove(button);
    });
  }


  // VERBESSERN!!! Funktioniert noch nicht richtig gut.

  addNewSubtask() {
    const SubTaskValue = this.addTaskForm.value.subtask;
    this.addTaskForm.get('subtask')?.setValue('');
    this.subtaskService.addSubTask(SubTaskValue);

    this.subtaskService.mySubTasks$.subscribe(() => {
      const existingSubtask = this.subtaskService.subTasks.find(subtask => subtask.title === SubTaskValue);

      if (existingSubtask && existingSubtask.id !== undefined) {
        const isAlreadyAdded = this.subtasksforView.some((subtask: { id: number }) => subtask.id === existingSubtask.id);
        if (!isAlreadyAdded) {
          this.subtasksforView.push(existingSubtask);
        }
      }
    });
  }

  deleteTask(id: any) {
    this.taskService.deleteTask(id);
    this.popupService.closePopups();
  }

  changeTask(task: any) {
    this.onSubmit(task.id)
    this.popupService.closePopups();
  }

}
