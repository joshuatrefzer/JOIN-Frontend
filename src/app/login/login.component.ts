import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormsModule, FormGroup} from '@angular/forms';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  // passwordFormControl = new FormControl('', [Validators.required]);
  // firstnameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  // lastnameFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  isChecked:boolean = false;

  user: User = {} as User;

  public loginForm: FormGroup = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], []),

    password: new FormControl('', [
      Validators.required
    ] , [] )
    
  });


  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService){
    }


    onSubmit() {
      console.log(this.loginForm);
    }

    

}
