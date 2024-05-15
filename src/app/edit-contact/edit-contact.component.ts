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

  onSubmit() {
    if (this.contactForm.valid) {
      if (this.popupService.contactForView) {
        this.contactService.updateContact(this.contactForm, this.popupService.contactForView.id);
        this.popupService.contactForView = null;
        this.contactService.showContactContainer = false;
      }
      this.popupService.closePopups();
    }
  }

  deleteUser() {
    const userId = this.popupService.contactForView?.id;
    if (userId) {
      this.contactService.deleteContact(userId);
      this.popupService.contactForView = null;
      this.popupService.editContact = false;
      this.popupService.closePopups();
    }
  }


}
