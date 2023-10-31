import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskForViewComponent } from './task-for-view.component';

describe('TaskForViewComponent', () => {
  let component: TaskForViewComponent;
  let fixture: ComponentFixture<TaskForViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskForViewComponent]
    });
    fixture = TestBed.createComponent(TaskForViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
