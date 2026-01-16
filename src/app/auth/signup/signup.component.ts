import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupName,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doseNotContainQuestionMark: true };
}

function emailIsNotUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }
  return of({ notUnique: true });
}

function confirmPasswordDoseNotMatch(
  control: AbstractControl,
  passwordControl: AbstractControl
) {
  if (control.value === passwordControl.value) {
    return null;
  }
  return { doseNotMatch: true };
}

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-signup-form');

if (savedForm) {
  const savedFormData = JSON.parse(savedForm);
  initialEmailValue = savedFormData.email;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsNotUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    streer: new FormControl('', { validators: [Validators.required] }),
    number: new FormControl('', { validators: [Validators.required] }),
    postalCode: new FormControl('', { validators: [Validators.required] }),
    city: new FormControl('', { validators: [Validators.required] }),
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'others'
    >('student', { validators: [Validators.required] }),
    agree: new FormControl(false, { validators: [Validators.required] }),
  });

  get isEmailInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get isPasswordInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (val) =>
          window.localStorage.setItem(
            'saved-signup-form',
            JSON.stringify({ email: val.email })
          ),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
  }
}
