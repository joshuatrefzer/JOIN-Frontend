import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddtaskComponent } from './addtask.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { ContactService } from '../services/contact.service';
import { PoupService } from '../services/poup.service';
import { SubtaskService } from '../services/subtask.service';
import { TaskService } from '../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

const mockTemplateService = {};
const mockContactService = {
  contacts: jasmine.createSpy('contacts').and.returnValue([])
};

const mockPopupService = {
  closePopups: jasmine.createSpy('closePopups'),
  taskToEdit: null,
  editTaskPopup: false
};
const mockSubtaskService = {
  subtasks: jasmine.createSpy('subtasks').and.returnValue([
    { id: 1, title: 'Subtask A' },
    { id: 2, title: 'Subtask B' },
    { id: 3, title: 'Subtask C' },
  ])
};

const mockTaskService = {
  addTask: jasmine.createSpy('addTask'),
  updateTask: jasmine.createSpy('updateTask'),
  deleteTask: jasmine.createSpy('deleteTask')
};
const mockMatSnackBar = {
  open: jasmine.createSpy('open')
};

describe('AddtaskComponent', () => {
  let component: AddtaskComponent;
  let fixture: ComponentFixture<AddtaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddtaskComponent],
      providers: [
        { provide: TemplateService, useValue: mockTemplateService },
        { provide: ContactService, useValue: mockContactService },
        { provide: PoupService, useValue: mockPopupService },
        { provide: SubtaskService, useValue: mockSubtaskService },
        { provide: TaskService, useValue: mockTaskService },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(AddtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('subtasksForSubmit', () => {
    it('returns matching subtask IDs based on subtasksForView', () => {
      component.subtasksForView.set(['Subtask A', 'Subtask C']);
      const result = component.subtasksForSubmit();

      expect(result).toEqual([1, 3]);
    });
  });

  describe('fillForm', () => {
    it('should fill the form with task data from popupService', () => {
      const mockTask = {
        title: 'Test Task',
        description: 'A description',
        assigned_to: [1, 2],
        date: '2025-05-05',
        prio: 'urgent',
        category: 'work',
        subtasks: [10, 11]
      };

      component.popupService = {
        taskToEdit: mockTask,
      } as any;

      spyOn(component as any, 'fillContacts');
      spyOn(component as any, 'selectPrio');
      spyOn(component as any, 'fillSubTasks').and.returnValue(['Subtask A']);

      (component as any).fillForm();

      expect(component.addTaskForm.get('title')?.value).toBe('Test Task');
      expect(component.addTaskForm.get('description')?.value).toBe('A description');
      expect((component as any).fillContacts).toHaveBeenCalledWith([1, 2]);
      expect(component.addTaskForm.get('date')?.value).toBe('2025-05-05');
      expect((component as any).selectPrio).toHaveBeenCalledWith('urgent');
      expect(component.addTaskForm.get('category')?.value).toBe('work');
      expect(component.subtasksForView()).toEqual(['Subtask A']);
    });
  });

  describe('resetForm()', () => {
    it('should reset the form and assigned_contacts', () => {
      component.addTaskForm.setValue({
        title: 'Existing Title',
        category: 'Existing Category',
        date: '2025-05-05',
        description: 'Existing Description',
        subtask: ['Subtask 1'],
        assigned_to: [1 , 2 , 7],
        prio: 'medium'
      });
    
      component.assigned_contacts = [{ id: 1, first_name: 'John' , last_name: 'Doe' , mail: 'johndoe@email.com' , phone: '012345678' }];
      let componentForPrivate = component as any;
      spyOn(componentForPrivate, 'resetButtons');
    
      componentForPrivate.resetForm();
    
      expect(component.addTaskForm.get('title')?.value).toBe('');
      expect(component.addTaskForm.get('category')?.value).toBe('');
      expect(component.addTaskForm.get('date')?.value).toBe('');
      expect(component.addTaskForm.get('description')?.value).toBe('');
      expect(component.addTaskForm.get('subtask')?.value).toEqual([]);
      expect(component.addTaskForm.get('assigned_to')?.value).toEqual([]);
      expect(component.addTaskForm.get('prio')?.value).toBe('');
    
      expect(component.assigned_contacts).toEqual([]);
    
      expect(componentForPrivate.resetButtons).toHaveBeenCalled();
    });
  });

  describe('getMinDate()', () => {
    it('should return today\'s date in YYYY-MM-DD format', () => {
      const result = (component as any).getMinDate();
    
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const expectedDate = `${year}-${month}-${day}`;
    
      expect(result).toBe(expectedDate);
    });
  });

  describe('selectPrio', () => {
    let fakeElement: any;
  
    beforeEach(() => {
      fakeElement = {
        classList: {
          classes: new Set<string>(),
          contains(cls: string) {
            return this.classes.has(cls);
          },
          add(cls: string) {
            this.classes.add(cls);
          },
          remove(cls: string) {
            this.classes.delete(cls);
          }
        }
      };
      spyOn(component['el'].nativeElement, 'querySelector').and.callFake(() => fakeElement);
    });
  
    describe('when selecting a prio', () => {
      it('should add the prio class and set the form value if not already selected', () => {
        fakeElement.classList.classes.clear();
  
        (component as any).selectPrio('urgent');
  
        expect(fakeElement.classList.contains('urgent')).toBeTrue();
        expect(component.addTaskForm.get('prio')?.value).toBe('urgent');
      });
  
      it('should remove the prio class and reset form value if prio already selected', () => {
        fakeElement.classList.classes.add('urgent');
  
        (component as any).selectPrio('urgent');
  
        expect(fakeElement.classList.contains('urgent')).toBeFalse();
        expect(component.addTaskForm.get('prio')?.value).toBe('');
      });
  
      it('should do nothing if prio is not in the valid list', () => {
        (component as any).selectPrio('invalid-prio');
        expect(component.addTaskForm.get('prio')?.value).toBe('');
      });
    });
  });

  describe('addNewSubtask()', () => {
    beforeEach(() => {
      component.addTaskForm.get('subtask')?.setValue('Test Subtask');
  
      component.subtaskService = {
        subtasks: jasmine.createSpy().and.returnValue([
          { id: 1, title: 'Existing Subtask' }
        ]),
        addSubTask: jasmine.createSpy()
      } as any;
  
      component.subtasksForView.set([]);
    });
  
    it('should do nothing if subtask is already displayed', () => {
      component.subtasksForView.set(['Test Subtask']);
      spyOn<any>(component, 'pushToSubtaskForView');
      spyOn<any>(component, 'emptySuptaskInputField');
  
      component.addNewSubtask();
  
      expect(component['pushToSubtaskForView']).not.toHaveBeenCalled();
      expect(component['subtaskService'].addSubTask).not.toHaveBeenCalled();
      expect(component['emptySuptaskInputField']).not.toHaveBeenCalled();
    });
  
    it('should add existing subtask title to view if it matches (case-insensitive)', () => {
      component.addTaskForm.get('subtask')?.setValue('existing subtask');
  
      spyOn<any>(component, 'pushToSubtaskForView');
      spyOn<any>(component, 'emptySuptaskInputField');
  
      component.addNewSubtask();
  
      expect(component['pushToSubtaskForView']).toHaveBeenCalledWith('Existing Subtask');
      expect(component['subtaskService'].addSubTask).not.toHaveBeenCalled();
      expect(component['emptySuptaskInputField']).toHaveBeenCalled();
    });
  
    it('should add new subtask title and call service', () => {
      component.addTaskForm.get('subtask')?.setValue('New Unique Subtask');
  
      spyOn<any>(component, 'pushToSubtaskForView');
      spyOn<any>(component, 'emptySuptaskInputField');
  
      component.addNewSubtask();
  
      expect(component['pushToSubtaskForView']).toHaveBeenCalledWith('New Unique Subtask');
      expect(component['subtaskService'].addSubTask).toHaveBeenCalledWith('New Unique Subtask');
      expect(component['emptySuptaskInputField']).toHaveBeenCalled();
    });
  });

  describe('pushToSubtaskForView()', () => {
    it('should append subtask to subtasksForView signal array', () => {
      component.subtasksForView.set(['First Subtask']);
  
      (component as any).pushToSubtaskForView('Second Subtask');
  
      const updated = component.subtasksForView();
      expect(updated.length).toBe(2);
      expect(updated).toContain('First Subtask');
      expect(updated).toContain('Second Subtask');
    });
  
    it('should handle empty subtasksForView array correctly', () => {
      component.subtasksForView.set([]);
  
      (component as any).pushToSubtaskForView('Only Subtask');
  
      const updated = component.subtasksForView();
      expect(updated).toEqual(['Only Subtask']);
    });
  });

  describe('subtaskIsAlreadyDisplayed()', () => {
    it('should return true if the subtask is already in the list', () => {
      component.subtasksForView.set(['Task A', 'Task B']);
  
      const result = (component as any).subtaskIsAlreadyDisplayed('Task A');
  
      expect(result).toBeTrue();
    });
  
    it('should return false if the subtask is not in the list', () => {
      component.subtasksForView.set(['Task A', 'Task B']);
  
      const result = (component as any).subtaskIsAlreadyDisplayed('Task C');
  
      expect(result).toBeFalse();
    });
  
    it('should return false if the list is empty', () => {
      component.subtasksForView.set([]);
  
      const result = (component as any).subtaskIsAlreadyDisplayed('Anything');
  
      expect(result).toBeFalse();
    });
  });
  
  
  
  

  


  
  
// describe('', () => {});


});
