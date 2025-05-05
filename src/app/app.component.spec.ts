import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { PoupService } from './services/poup.service';
import { ContactService } from './services/contact.service';
import { SubtaskService } from './services/subtask.service';
import { TaskService } from './services/task.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let authServiceMock: any;
  let popupServiceMock: any;
  let contactServiceMock: any;
  let subTaskServiceMock: any;
  let taskServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(() => {
    authServiceMock = {};

    popupServiceMock = {
      loader: false
    };

    contactServiceMock = {
      getContacts: jasmine.createSpy('getContacts')
    };

    subTaskServiceMock = {
      getSubTasks: jasmine.createSpy('getSubTasks')
    };

    taskServiceMock = {
      getTasks: jasmine.createSpy('getTasks')
    };

    activatedRouteMock = {
      queryParams: of({})
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: PoupService, useValue: popupServiceMock },
        { provide: ContactService, useValue: contactServiceMock },
        { provide: SubtaskService, useValue: subTaskServiceMock },
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'JOIN'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('JOIN');
  });
});
