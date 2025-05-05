import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskForViewComponent } from './task-for-view.component';
import { PoupService } from '../services/poup.service';
import { TaskService } from '../services/task.service';
import { SubtaskService } from '../services/subtask.service';

describe('TaskForViewComponent', () => {
  let component: TaskForViewComponent;
  let fixture: ComponentFixture<TaskForViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskForViewComponent],
      providers: [
        { provide: PoupService, useValue: {} },
        { provide: TaskService, useValue: {} },
        { provide: SubtaskService, useValue: {} },
      ]
    });

    fixture = TestBed.createComponent(TaskForViewComponent);
    component = fixture.componentInstance;
  });


  describe('formatDate()', () => {
    it('should format the task date correctly', () => {
      const mockDate = new Date('2024-05-05T00:00:00Z'); // Sunday
      component.task = { date: mockDate.toISOString() } as any;

      component.formatDate();

      expect(component.formattedDate).toBe('Sunday, 5 May 2024');
    });

    it('should not set formattedDate if task or date is missing', () => {
      component.task = undefined;
      component.formatDate();
      expect(component.formattedDate).toBe('');

      component.task = {} as any;
      component.formatDate();
      expect(component.formattedDate).toBe('');
    });
  });

});
