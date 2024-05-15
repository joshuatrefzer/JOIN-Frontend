import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
  ) {
    this.sortedContacts = this.contactService.contacts.sort((a, b) => a.first_name.localeCompare(b.first_name));
   }

  mobile:boolean = true;
  hideContactContainer: boolean = false;
  deleteContact: boolean = false;
  sortedContacts;


  ngOnInit(): void {
    this.contactService.getContacts();
    this.checkForMobileView();
    if (this.mobile) {
      this.contactService.showInfo = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkForMobileView();
  }

  checkForMobileView(){
    if (window.innerWidth < 1000) {
      this.mobile = true;
    } else {
      this.mobile = false;
      this.contactService.showInfo = false;
    }
  }


  ngOnDestroy(): void {
    this.contactService.showInfo = false;
    this.contactService.showContactContainer = false;
    this.popupService.contactForView = null;
  }


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
    if (this.contactService.showContactContainer) {
      this.hideContactContainer = true;
      this.contactService.showContactContainer = false;
      setTimeout(() => {
        this.contactService.showContactContainer = true;
        this.hideContactContainer = false;
      }, 300);
    }
    this.popupService.contactForView = contact;

    this.removeSelection();
    const element = this.el.nativeElement.querySelector(`#contact${id}`);
    this.renderer.addClass(element, 'selected-contact');
    this.showContainer(id);
    if(this.mobile) this.contactService.showInfo = true;
  }





  delete() {
    if (this.popupService.contactForView) {
      this.contactService.deleteContact(this.popupService.contactForView.id)
    }
    this.contactService.showInfo = false;
  }

  showContainer(id: number) {
    this.contactService.showContactContainer = true;
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
