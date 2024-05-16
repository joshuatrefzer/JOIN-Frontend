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

  mobile: boolean = true;
  hideContactContainer: boolean = false;
  deleteContact: boolean = false;
  sortedContacts;


  /**
  * Initializes the component by fetching contacts and checking for mobile view.
  * 
  * Fetches contacts from the contact service, and checks if the view is in mobile mode.
  * If in mobile mode, hides contact information initially.
  */
  ngOnInit(): void {
    // Fetch contacts from the contact service
    this.contactService.getContacts();

    // Check for mobile view and hide contact information if in mobile mode
    this.checkForMobileView();
  }

  /**
  * Cleans up component resources before destruction.
  * 
  * Resets contact service properties and clears contact popup data.
  */
  ngOnDestroy(): void {
    // Reset contact service properties
    this.contactService.showInfo = false;
    this.contactService.showContactContainer = false;

    // Clear contact popup data
    this.popupService.contactForView = null;
  }

  /**
  * Listens for window resize events and triggers mobile view check.
  * 
  * @param {Event} event The resize event object.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Check for mobile view on window resize
    this.checkForMobileView();
  }

  /**
  * Checks if the current view is in mobile mode based on window width.
  * 
  * If the window width is less than 1000 pixels, sets the mobile flag to true and hides contact information.
  * Otherwise, sets the mobile flag to false and ensures contact information is visible.
  */
  checkForMobileView() {
    if (window.innerWidth < 1000) {
      // If in mobile mode, hide contact information
      this.mobile = true;
    } else {
      // If not in mobile mode, ensure contact information is visible
      this.mobile = false;
      this.contactService.showInfo = false;
    }
  }



  /**
   * Groups contacts by the first letter of their first name.
   * 
   * @returns An object where keys are the first letters of contact first names, and values are arrays of contacts.
   */
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

  /**
  * Retrieves unique first letters of contact first names.
  * 
  * @returns An array containing unique first letters of contact first names.
  */
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


  /**
  * Displays detailed information of a contact.
  * 
  * @param {number} id The ID of the contact to be displayed.
  * @param {Contact} contact The contact object to be displayed.
  */
  showContact(id: number, contact: Contact) {
    if (this.contactService.showContactContainer) {
      this.hideContactContainer = true;
      this.contactService.showContactContainer = false;
      setTimeout(() => {
        this.contactService.showContactContainer = true;
        this.hideContactContainer = false;
      }, 300);
    }
    // Set the contact for detailed view in the popup service
    this.popupService.contactForView = contact;

    // Remove any previous selection and add selection to the clicked contact
    this.removeSelection();
    const element = this.el.nativeElement.querySelector(`#contact${id}`);
    this.renderer.addClass(element, 'selected-contact');

    // Show the contact container
    this.showContainer(id);

    // Show contact information if in mobile mode
    if (this.mobile) this.contactService.showInfo = true;
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
