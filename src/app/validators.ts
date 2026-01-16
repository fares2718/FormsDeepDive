import { AbstractControl } from '@angular/forms';
import { of } from 'rxjs';

export class Validators {
  mustContainQuestionMark(control: AbstractControl) {
    if (control.value.includes('?')) {
      return null;
    }
    return { doseNotContainQuestionMark: true };
  }

  emailIsNotUnique(control: AbstractControl) {
    if (control.value !== 'test@example.com') {
      return of(null);
    }
    return of({ notUnique: true });
  }

  confirmPasswordDoseNotMatch(
    control: AbstractControl,
    passwordControl: AbstractControl
  ) {
    if (control.value === passwordControl.value) {
      return null;
    }
    return { doseNotMatch: true };
  }
}
