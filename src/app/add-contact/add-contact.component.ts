import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PoupService } from '../services/poup.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {

  constructor(public popupService: PoupService){}

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
