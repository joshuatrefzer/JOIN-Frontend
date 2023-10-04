import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { User } from '../services/user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  constructor(
    public templateService: TemplateService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }





  ngOnInit(): void {
    this.templateService.contacts = true;
  }

  ngOnDestroy(): void {
    this.templateService.contacts = false;
  }



  contacts: User[] = [
    { id: 1, first_name: 'Alice', last_name: 'müller', email: 'alice@example.com', active: true },
    { id: 2, first_name: 'Bob', last_name: 'Höfer', email: 'alice@example.com', active: true },
    { id: 3, first_name: 'Gudrun', last_name: 'Schmidt', email: 'alice@example.com', active: true },
    { id: 4, first_name: 'Budrun', last_name: 'Schmidt', email: 'alice@example.com', active: true },
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

  showContact(id: number) {
    this.removeSelection();
    const element = this.el.nativeElement.querySelector(`#contact${id}`);
    this.renderer.addClass(element, 'selected-contact');
  }

  removeSelection() {
    for(const contact of this.contacts){
      const element = this.el.nativeElement.querySelector(`#contact${contact.id}`);
      this.renderer.removeClass(element, 'selected-contact');
    }
  }

}
