import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { User } from '../services/user.service';
import { PoupService } from '../services/poup.service';

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
    private el: ElementRef
  ) { }


  ngOnInit(): void {
    this.templateService.contacts = true;
  }

  ngOnDestroy(): void {
    this.templateService.contacts = false;
  }


  showContactContainer: boolean = false;
  hideContactContainer: boolean = false;



  contacts: User[] = [
    { id: 1, first_name: 'Alice', last_name: 'müller', email: 'alice@example.com', 'phone': '01756245', active: true },
    { id: 2, first_name: 'Bob', last_name: 'Höfer', email: 'alice@example.com', 'phone': '01756245', active: true },
    { id: 3, first_name: 'Gudrun', last_name: 'Schmidt', email: 'alice@example.com', 'phone': '01756245', active: true },
    { id: 4, first_name: 'Budrun', last_name: 'Schmidt', email: 'alice@example.com', 'phone': '01756245', active: true },
    // Weitere Kontakte hier hinzufügen
  ];


  // Sortiere die Kontakte nach dem Namen
  sortedContacts = this.contacts.sort((a, b) => a.first_name.localeCompare(b.first_name));

  // Methode zur Gruppierung der Kontakte nach Buchstaben
  groupContactsByLetter() {
    const groupedContacts: { [key: string]: User[] } = {};

    this.contacts.forEach(contact => {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();
      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }
      groupedContacts[firstLetter].push(contact);
    });

    return groupedContacts;
  }

  // Methode zur Extraktion eindeutiger Buchstaben
  getUniqueLetters() {
    const letters: string[] = [];
    this.contacts.forEach(contact => {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();
      if (!letters.includes(firstLetter)) {
        letters.push(firstLetter);
      }
    });
    return letters;
  }

  showContact(id: number, contact: User) {
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


  showContainer(id: number) {
    this.showContactContainer = true;
  }


  removeSelection() {
    for (const contact of this.contacts) {
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
