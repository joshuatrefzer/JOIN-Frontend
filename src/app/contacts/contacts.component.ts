import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { User } from '../services/user.service';
import { PoupService } from '../services/poup.service';
import { Contact, ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  constructor(
    public templateService: TemplateService,
    public popupService: PoupService,
    private renderer: Renderer2,
    public contactService: ContactService,
    private el: ElementRef
  ) { }


  ngOnInit(): void {
    this.templateService.contacts = true;
    this.contactService.getContacts();
  }
  

  ngOnDestroy(): void {
    this.templateService.contacts = false;
  }


  showContactContainer: boolean = false;
  hideContactContainer: boolean = false;
  deleteContact:boolean = false;

  sortedContacts = this.contactService.contacts.sort((a, b) => a.first_name.localeCompare(b.first_name));

 
   groupContactsByLetter() {
    const groupedContacts: { [key: string]: Contact[] } = {};

    this.contactService.contacts.forEach(contact => {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();
      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }
      groupedContacts[firstLetter].push(contact);
    });

    return groupedContacts;
  }

  
  getUniqueLetters() {
    const letters: string[] = [];
    this.contactService.contacts.forEach(contact => {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();
      if (!letters.includes(firstLetter)) {
        letters.push(firstLetter);
      }
    });
    return letters;
  }

  showContact(id: number, contact: Contact) {
    if (this.showContactContainer) {
      this.hideContactContainer = true;
      this.showContactContainer = false;
      setTimeout(() => {
        this.showContactContainer = true;
        this.hideContactContainer = false;
      }, 300);
    }
    this.popupService.contactForView = contact;

    this.removeSelection();
    const element = this.el.nativeElement.querySelector(`#contact${id}`);
    this.renderer.addClass(element, 'selected-contact');
    this.showContainer(id);
  }

  delete() {

    if (this.popupService.contactForView) {
      this.contactService.deleteContact(this.popupService.contactForView.id)
    }
  }

  showContainer(id: number) {
    this.showContactContainer = true;
  }


  removeSelection() {
    for (const contact of this.contactService.contacts) {
      const element = this.el.nativeElement.querySelector(`#contact${contact.id}`);
      this.renderer.removeClass(element, 'selected-contact');
    }
  }


  openAddContactPopup() {
    this.popupService.behindPopupContainer = true;
    this.popupService.addContact = true;
  }

  openEditContactPopup() {
    this.popupService.behindPopupContainer = true;
    this.popupService.editContact = true;
  }

  hidePopup() {
    this.popupService.behindPopupContainer = false;
  }

}
