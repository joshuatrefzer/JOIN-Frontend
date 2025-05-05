import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useValue: {} },
        { provide: ActivatedRoute, useValue: { queryParams: of({ token: 'test-token' }) } },
        { provide: HttpClient, useValue: { post: () => of({}) } },
        { provide: MatSnackBar, useValue: { open: () => {} } },
        { provide: Router, useValue: { navigate: () => {} } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ResetPasswordComponent - passwordValidator', () => {
    let component: ResetPasswordComponent;
  
    beforeEach(() => {
      const mockActivatedRoute = {
        queryParams: of({ token: 'dummy-token' }) 
      };

      component = new ResetPasswordComponent(
        {} as any,                      // AuthenticationService
        mockActivatedRoute as any,      // ActivatedRoute (zweiter Parameter!)
        {} as any,                      // HttpClient
        {} as any,                      // MatSnackBar
        {} as any                       // Router
      );
    });
  
    describe('passwordValidator()', () => {
  
      it('should return null for a valid password', () => {
        const control = new FormControl('Valid123!');
        const result = (component as any).passwordValidator(control);
        expect(result).toBeNull();
      });
  
      it('should return error for password without uppercase', () => {
        const control = new FormControl('invalid123!');
        const result = (component as any).passwordValidator(control);
        expect(result).toEqual({ invalidPassword: true });
      });
  
      it('should return error for password without lowercase', () => {
        const control = new FormControl('INVALID123!');
        const result = (component as any).passwordValidator(control);
        expect(result).toEqual({ invalidPassword: true });
      });
  
      it('should return error for password without number', () => {
        const control = new FormControl('InvalidABC!');
        const result = (component as any).passwordValidator(control);
        expect(result).toEqual({ invalidPassword: true });
      });
  
      it('should return error for password without special character', () => {
        const control = new FormControl('Invalid123');
        const result = (component as any).passwordValidator(control);
        expect(result).toEqual({ invalidPassword: true });
      });
  
      it('should return error for empty password', () => {
        const control = new FormControl('');
        const result = (component as any).passwordValidator(control);
        expect(result).toEqual({ invalidPassword: true });
      });
    });
  });

  describe('passwordRepeat()', () => {

    it('should return true when password and repeat password match and length is greater than 1', () => {
      component.pwResetForm.get('password')?.setValue('ValidPassword123!');
      component.pwResetForm.get('repeatpassword')?.setValue('ValidPassword123!');
      
      const result = component.passwordRepeat('repeatpassword', 'password');
      expect(result).toBeTrue();
    });

    it('should return false when password and repeat password do not match', () => {
      component.pwResetForm.get('password')?.setValue('Password123!');
      component.pwResetForm.get('repeatpassword')?.setValue('DifferentPassword123!');
      
      const result = component.passwordRepeat('repeatpassword', 'password');
      expect(result).toBeFalse();
    });

    it('should return false when repeat password is too short', () => {
      component.pwResetForm.get('password')?.setValue('Password123!');
      component.pwResetForm.get('repeatpassword')?.setValue('P');
      
      const result = component.passwordRepeat('repeatpassword', 'password');
      expect(result).toBeFalse();
    });

  });

});
