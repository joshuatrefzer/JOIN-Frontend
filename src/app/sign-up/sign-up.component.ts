import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public loginForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], []),

    password: new FormControl('', [
      Validators.required
    ] , [] ),

    lastname: new FormControl('', [
      Validators.required
    ] , [] ),

    firstname: new FormControl('', [
      Validators.required
    ] , [] ),
    
  });

onSubmit() {
throw new Error('Method not implemented.');
}

redirectToLogin() {
  //implementieren!
}

}
