import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    standalone: false
})
export class ResetPasswordComponent {

  token:string = '';
  newPassword: string = '';
  pwResetForm: FormGroup;

  constructor(auth:AuthenticationService, private route:ActivatedRoute, private http:HttpClient, private snackBar: MatSnackBar,private router: Router){
    this.pwResetForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordValidator.bind(this)]),
      repeatpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
  }); 
}


  /**
   * 
   * @returns a valid formdata for passwordreset. If form isn't valid, it returns false
   */
  getFormData() {
    if (this.isFormValid()) {
      const formData = new FormData();
      formData.append('password', this.pwResetForm.get('password')?.value);
      formData.append('token', this.token);
      return formData;
    } else {
      console.log('Error by reset your password. Do you have filled all fields correctly?');
      return false;
    }
  }

  /**
   * 
   * @returns only if data is not in the expected format and not valid. So we don't send it as a request to prevent errors on server side.
   */
  resetPassword(): void {
    const url = 'https://joshuatrefzer.pythonanywhere.com' + '/password_reset/confirm/';
    const data = this.getFormData();
    if (!data) return
    this.http.post<any>(url, data).subscribe(response => {
      this.snackBar.open('Password reset successful', 'close', {
        duration: 3000,
        panelClass: ['blue-snackbar']
      });
      this.pwResetForm.reset();
    }, error => {
      this.snackBar.open('Your request failed, maybe your token is not vaild anymore.', 'close', {
        duration: 3000,
        panelClass: ['blue-snackbar']
      });
      console.error(error);
    });
  }

  /**
   * redirects to login page
   */
  directToLogin(){
    this.router.navigate(['']);
    location.reload();
  }

  /**
   * 
   * @returns if active form is valid
   */
  isFormValid() {
    const myForm = this.whichFormToUse();
    return myForm?.valid;
  }


  /**
   * 
   * @param control is formcontrol from angular to observe the fields input
   * @returns if password is valid, or not
   */
  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const valid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

    return valid ? null : { 'invalidPassword': true };
  }


  /**
 * Checks for a "required" validation error on a field identified by `key`.
 * Returns `true` if the field has a "required" error and user interacted (dirty/touched), `false` otherwise.
 */
  emailError(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['email'] && this.dirtyTouched(field);
    }
  }


  /**
 * Retrieves a field from the currently used form (`pwResetForm`) based on the provided `key`.
 * Returns the field object if found, `undefined` otherwise.
 */
  getField(key: string) {
    let myForm = this.whichFormToUse();
    let field = myForm?.get(key);
    return field;
  }

  /**
 * Checks if a form field is either dirty (modified) or touched (focused).
 * Returns `true` if dirty or touched, `false` otherwise.
 */
  dirtyTouched(field: any) {
    return (field.dirty || field.touched);
  }

  /**
 * Checks if a field identified by `key` is invalid and has user interaction (dirty/touched).
 * Returns `true` if the field is invalid with user interaction, `false` otherwise.
 */
  isInvalid(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.invalid && this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  /**
 * Checks if a field identified by `key` has valid input.
 * Returns `true` if the field is not invalid and has a valid value, `false` otherwise.
 */
  isValidInput(key: string) {
    const field = this.getField(key);
    if (field) {
      return !this.isInvalid(key) && field.valid;
    } else {
      return false;
    }
  }


  /**
 * Checks for a "required" validation error on a field identified by `key`.
 * Returns `true` if the field has a "required" error and user interacted (dirty/touched), `false` otherwise.
 */
  requiredErrors(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['required'] && this.dirtyTouched(field);
    } else {
      return false;
    }
  }


  /**
 * Checks for a "minlength" validation error on a field identified by `key`.
 * Returns the error object if it exists, `false` otherwise.
 */
  minLengthError(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['minlength'];
    } else {
      return false;
    }
  }


  /**
 * Compares password and confirm password fields for matching values and minimum length.
 * 
 * This function retrieves the values of two form fields identified by `repeat` and `pw`.
 * It then checks if:
 *  - Both fields have values.
 *  - The password values match.
 *  - The password length is greater than 1.
 * 
 * Returns `true` if all conditions are met (matching passwords with minimum length), `false` otherwise.
 */
  passwordRepeat(repeat: string, pw: string) {
    const repeatedPWControl = this.pwResetForm.get(repeat);
    const passwordControl = this.pwResetForm.get(pw);

    if (repeatedPWControl && passwordControl) {
        const repeatedPW = repeatedPWControl.value;
        const password = passwordControl.value;
        return repeatedPW === password && repeatedPW.length > 1;
    } else {
        return false;
    }
}

   /**
   * Assumes `pwResetForm` is the form to be used and returns it.
   */
   whichFormToUse() {
    let myform = this.pwResetForm;

    return myform;
  }

  
}



