import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PoupService } from '../services/poup.service';
import { ContactService } from '../services/contact.service';


@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent {
  public contactForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], []),

    phone: new FormControl('', [
      Validators.required, Validators.pattern('^[0-9]*$')
    ] , [] ),

    first_name: new FormControl('', [
      Validators.required
    ] , [] ),

    last_name: new FormControl('', [
      Validators.required
    ] , [] ),
  });

  
  constructor(
    public popupService: PoupService,
    public contactService: ContactService,
  ) { }


  /**
 * Handles the submission of the contact form.
 * 
 * If the form is valid, updates the contact if it exists in the popup service.
 * Closes any open popups after submission.
 */
onSubmit() {
  if (this.contactForm.valid) {
      // If form is valid
      if (this.popupService.contactForView) {
          // If contact exists in the popup service, update the contact
          this.contactService.updateContact(this.contactForm, this.popupService.contactForView.id);
          this.popupService.contactForView = null;
          this.contactService.showContactContainer = false;
      }
      // Close any open popups
      this.popupService.closePopups();
  }
}


/**
* Deletes the user (contact) from the system.
* 
* If the user ID exists, deletes the contact from the contact service.
* Closes any open popups after deletion.
*/
deleteUser() {
  // Get the ID of the user (contact) to be deleted
  const userId = this.popupService.contactForView?.id;
  if (userId) {
      // If user ID exists, delete the contact from the contact service
      this.contactService.deleteContact(userId);
      this.popupService.contactForView = null;
      this.popupService.editContact = false;
      // Close any open popups
      this.popupService.closePopups();
  }
}


}
