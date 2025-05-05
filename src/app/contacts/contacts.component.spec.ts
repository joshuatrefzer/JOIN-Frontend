import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsComponent } from './contacts.component';
import { ContactService } from '../services/contact.service';
import { TemplateService } from '../services/template.service';
import { PoupService } from '../services/poup.service';
import { Renderer2, ElementRef } from '@angular/core';

fdescribe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;
  let mockPopupService: jasmine.SpyObj<PoupService>;
  let mockTemplateService: jasmine.SpyObj<TemplateService>;

  beforeEach(async () => {
    const contactList = [
      { id: 1, first_name: 'Alice', last_name: 'Miller', mail: 'alice@example.com', phone: '123456789' },
      { id: 2, first_name: 'Bob', last_name: 'Smith', mail: 'bob@example.com', phone: '987654321' },
    ];

    const contactsSignal = jasmine.createSpy().and.returnValue(contactList);

    mockContactService = jasmine.createSpyObj('ContactService', ['deleteContact'], {
      contacts: contactsSignal,
      showInfo: false,
      showContactContainer: false,
    });

    mockPopupService = jasmine.createSpyObj('PoupService', {}, {
      contactForView: null,
      behindPopupContainer: false,
      addContact: false,
      editContact: false,
    });

    mockTemplateService = {} as jasmine.SpyObj<TemplateService>;


    await TestBed.configureTestingModule({
      declarations: [ContactsComponent],
      providers: [
        { provide: ContactService, useValue: mockContactService },
        { provide: PoupService, useValue: mockPopupService },
        { provide: TemplateService, useValue: mockTemplateService },
        { provide: Renderer2, useValue: jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']) },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('when grouping contacts by letter', () => {
    it('should calculate unique letters from contact first names', () => {
      const result = component.uniqueLetters();
      expect(result).toEqual(['A', 'B']);
    });

    it('should group contacts by first letter of first_name', () => {
      const result = component.groupedContactsByLetter();

      expect(result).toEqual({
        A: [
          { id: 1, first_name: 'Alice', last_name: 'Miller', mail: 'alice@example.com', phone: '123456789' }
        ],
        B: [
          { id: 2, first_name: 'Bob', last_name: 'Smith', mail: 'bob@example.com', phone: '987654321' }
        ]
      });
    });
  });






});