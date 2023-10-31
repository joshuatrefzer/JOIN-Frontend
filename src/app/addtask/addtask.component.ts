import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact, ContactService } from '../services/contact.service';
import { SubtaskService } from '../services/subtask.service';
import { TaskService } from '../services/task.service';
import { PoupService } from '../services/poup.service';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit, OnDestroy {


  buttons = ['urgent', 'medium', 'low'];

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    d = d || today;
    return d >= today;
  };

  subtasksforView: any = [];
  subtasksForSubmit: any = []

  assigned_contacts: any = [];



  constructor(
    public templateService: TemplateService,
    public contactService: ContactService,
    public popupService: PoupService,
    public subtaskService: SubtaskService,
    public taskService: TaskService,
    private renderer: Renderer2, private el: ElementRef

  ) { }


  ngOnInit(): void {
    if (!this.popupService.addTaskPopup) {
      this.templateService.addTask = true;
    }
    
    this.contactService.getContacts();
    this.subtaskService.getSubTasks();
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.templateService.addTask = false;

  }

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


  
  onSubmit() {
    if (!this.addTaskForm.valid) {
      console.log('Fülle die Form aus');
      return;
    }

    this.addTaskForm.value.date = this.addTaskForm.value.date.toISOString().split('T')[0];
    if (this.subtasksforView.length >= 1) {
      for (const subtask of this.subtasksforView) {
        this.subtasksForSubmit.push(`${subtask.id}`);
      }
    }
    this.addTaskForm.value.subtask = this.subtasksForSubmit;
    this.taskService.addTask(this.addTaskForm)
    //send to backend
    this.subtaskService.mySubTasks$.subscribe(() => {
      this.subtasksForSubmit = [];
      this.subtasksforView = [];
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


  assigneContact(contact: Contact) {
    this.assigned_contacts.push(contact);

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


  // addNewSubtask() {
  //   const SubTaskValue = this.addTaskForm.value.subtask;
  //   this.addTaskForm.get('subtask')?.setValue('');
  //   this.subtaskService.addSubTask(SubTaskValue);
  //   this.subtaskService.mySubTasks$.subscribe(() => {
  //     const subTasks = this.subtaskService.subTasks;
  //     let existingSubtask;
  //     //Probleme -> Beim löschen wird hier auch aufgerufen und andere Werte mit gleichem Titel kommen nach.. (subscribtion)
  //     //Das hinzugefügte objekt taucht in der SChleife noch nicht auf und es wird (wenn vorhanden) auf einen späteren Wert zugegriffen

  //     for (let i = this.subtaskService.subTasks.length - 1; i >= 0; i--) {
  //       if (this.subtaskService.subTasks[i].title === SubTaskValue) {
  //         debugger
  //         existingSubtask = subTasks[i];
  //         break; // Breche die Schleife ab, sobald der gesuchte Wert gefunden wurde
  //       }
  //     }
  //     if (existingSubtask && existingSubtask.id !== undefined) {
  //       if (!this.subtasksforView.includes(existingSubtask)) {
  //         this.subtasksforView.push(existingSubtask);
  //       }
  //     }
  //   });
  // }






}
