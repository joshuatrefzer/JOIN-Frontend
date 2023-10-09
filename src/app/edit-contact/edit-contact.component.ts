import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PoupService } from '../services/poup.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent {


constructor(public popupService : PoupService) {}

onSubmit() {
throw new Error('Method not implemented.');
}



  public loginForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], []),

    phone: new FormControl('', [
      Validators.required
    ] , [] ),

    fullname: new FormControl('', [
      Validators.required
    ] , [] ),

  });

}
