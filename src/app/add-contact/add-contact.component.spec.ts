import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddContactComponent } from './add-contact.component';
import { ContactService } from '../services/contact.service';
import { PoupService } from '../services/poup.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddContactComponent', () => {
  let component: AddContactComponent;
  let fixture: ComponentFixture<AddContactComponent>;
  
  const mockContactService = {
    addContact: jasmine.createSpy('addContact')
  };

  const mockPopupService = {
    closePopups: jasmine.createSpy('closePopups')
  };



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddContactComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
      providers:[
        { provide: ContactService, useValue: mockContactService },
        { provide: PoupService, useValue: mockPopupService }
      ],
    });
    fixture = TestBed.createComponent(AddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
