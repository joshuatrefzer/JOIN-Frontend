import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: false
})
export class ResetPasswordComponent {

  token: string = '';
  newPassword: string = '';
  pwResetForm: FormGroup;

  constructor(auth: AuthenticationService, private route: ActivatedRoute, private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {
    this.pwResetForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordValidator.bind(this)]),
      repeatpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

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

  async resetPassword(): Promise<void> {
    const url = environment.baseUrl + '/password_reset/confirm/';
    const data = this.getFormData();
  
    if (!data) return;
  
    try {
      await lastValueFrom(
        this.http.post<any>(url, data).pipe(
          catchError(error => {
            this.snackBar.open('Your request failed, maybe your token is not valid anymore.', 'close', {
              duration: 3000,
              panelClass: ['blue-snackbar']
            });
            console.error(error);
            throw error;
          })
        )
      );
  
      this.snackBar.open('Password reset successful', 'close', {
        duration: 3000,
        panelClass: ['blue-snackbar']
      });
      this.pwResetForm.reset();
  
    } catch (error) {
    }
  }

  directToLogin() {
    this.router.navigate(['']);
    location.reload();
  }

  isFormValid() {
    const myForm = this.whichFormToUse();
    return myForm?.valid;
  }

  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const valid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

    return valid ? null : { 'invalidPassword': true };
  }

  emailError(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['email'] && this.dirtyTouched(field);
    }
  }

  getField(key: string) {
    let myForm = this.whichFormToUse();
    let field = myForm?.get(key);
    return field;
  }

  dirtyTouched(field: any) {
    return (field.dirty || field.touched);
  }

  isInvalid(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.invalid && this.dirtyTouched(field);
    } else {
      return false;
    }
  }

  isValidInput(key: string) {
    const field = this.getField(key);
    if (field) {
      return !this.isInvalid(key) && field.valid;
    } else {
      return false;
    }
  }

  requiredErrors(key: string) {
    const field = this.getField(key);
    if (field) {
      return field.errors?.['required'] && this.dirtyTouched(field);
    } else {
      return false;
    }
  }

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


  whichFormToUse() {
    let myform = this.pwResetForm;

    return myform;
  }


}



