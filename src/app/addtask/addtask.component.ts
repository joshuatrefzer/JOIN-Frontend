import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent implements OnInit, OnDestroy {
  subtask = [''];

  buttons = ['urgent', 'medium', 'low'];

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    d = d || today;
    return d >= today;
  };



  constructor(
    public templateService: TemplateService,
    public contactService: ContactService,
    private renderer: Renderer2, private el: ElementRef

  ) { }


  ngOnInit(): void {
    this.templateService.addTask = true;
    this.contactService.getContacts();
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
    subtask: new FormControl(''),
    assigned_to: new FormControl(''),
    prio: new FormControl(''),

  });

  
  onSubmit() {
    debugger
    console.log(this.addTaskForm);
  }


  checkForKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.pushToSubtask(this.addTaskForm.get('subtask')?.value);
    }
  }

  pushToSubtask(value: string) {
    console.log(value);
    this.subtask.push(value);
    this.addTaskForm.get('subtask')?.setValue('');
  }

  resetForm() {
    this.addTaskForm.reset({
      title: '',
      category: '',
      date: '',
      description: '',
      subtask: '',
      assigned_to: '',
      prio: ''
    });
    this.subtask = [];
    this.resetButtons();
  }


  //   selectPrio(prio: string) {
  //   const buttons = ['urgent', 'medium', 'low'];
  //   const selectedElement = this.el.nativeElement.querySelector(`#${prio}`);

  //   // Überprüfen, ob die übergebene Prio gültig ist
  //   if (buttons.includes(prio)) {
  //     // Wenn der ausgewählte Prio-Button bereits die Klasse hat, die Auswahl aufheben
  //     if (selectedElement.classList.contains(prio)) {
  //       selectedElement.classList.remove(prio);
  //     } else {
  //       // Andernfalls alle Prio-Buttons zurücksetzen und die Klasse setzen
  //       buttons.forEach(button => {
  //         const element = this.el.nativeElement.querySelector(`#${button}`);
  //         element.classList.remove(button);
  //       });
  //       selectedElement.classList.add(prio);
  //     }
  //   } else {
  //     console.error('Ungültige Prio ausgewählt');
  //   }
  // }

  selectPrio(prio: string) {
    const selectedElement = this.el.nativeElement.querySelector(`#${prio}`);
    if (this.buttons.includes(prio)) {
      if (selectedElement.classList.contains(prio)) {
        selectedElement.classList.remove(prio);
        this.addTaskForm.value.prio = '';
      } else {
        this.resetButtons();
        selectedElement.classList.add(prio);
        this.addTaskForm.value.prio = `${prio}`;
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



}
