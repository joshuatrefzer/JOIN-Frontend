import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PoupService } from '../services/poup.service';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {

  constructor(
    public popupService: PoupService,
    public contactService: ContactService

  ) { }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm);
      this.contactService.addContact(this.contactForm);
      this.contactService.getContacts();
    }
  }



  public contactForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], []),

    phone: new FormControl('', [
      Validators.required
    ], []),

    first_name: new FormControl('', [
      Validators.required
    ], []),

    last_name: new FormControl('', [
      Validators.required
    ], []),

  });
}
