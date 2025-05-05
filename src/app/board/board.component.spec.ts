import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TemplateService } from '../services/template.service';
import { Task, TaskService } from '../services/task.service';
import { SubtaskService } from '../services/subtask.service';
import { ContactService } from '../services/contact.service';
import { PoupService } from '../services/poup.service';
import { LoaderComponent } from '../loader/loader.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    let mockTaskService: jasmine.SpyObj<TaskService>;
    let mockPopupService: jasmine.SpyObj<PoupService>;

    beforeEach(() => {
        const mockTasksSignal = jasmine.createSpy('tasksSignal') as any;
        mockTasksSignal.set = jasmine.createSpy('set');

        mockTaskService = jasmine.createSpyObj('TaskService', [
            'updateTaskStatus',
            'tasksBackupForSearch'
        ], {
            tasks: mockTasksSignal,
            status: ''
        });

        mockPopupService = jasmine.createSpyObj('PoupService', [], {
            behindPopupContainer: false,
            addTaskPopup: false
        });

        TestBed.configureTestingModule({
            declarations: [BoardComponent, LoaderComponent],
            providers: [
                { provide: TemplateService, useValue: {} },
                { provide: TaskService, useValue: mockTaskService },
                { provide: SubtaskService, useValue: {} },
                { provide: ContactService, useValue: {} },
                { provide: PoupService, useValue: mockPopupService },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });


    describe('searchTask', () => {
        it('should reset tasks if search is empty', () => {
            component.search = '  ';
            const mockBackup: Task[] = [{ title: 'Task A', description: 'Description A', status: 'todo', subtasks: [], assigned_to: [], id: 1, date: new Date(), prio: 'urgent', category: 'work' }];
            mockTaskService.tasksBackupForSearch.and.returnValue(mockBackup);

            component.searchTask();
            expect(mockTaskService.tasks.set).toHaveBeenCalledWith(mockBackup as any);
        });

        it('should filter tasks by title or description', () => {
            component.search = 'task';
            const mockBackup: any = [
                { title: 'Task One', description: 'some description' },
                { title: 'Another', description: 'task-related' },
                { title: 'Nothing', description: 'irrelevant' }
            ];
            mockTaskService.tasksBackupForSearch.and.returnValue(mockBackup);

            component.searchTask();
            expect(mockTaskService.tasks.set).toHaveBeenCalledWith([
                mockBackup[0],
                mockBackup[1]
            ]);
        });
    });
});
