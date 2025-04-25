import { AbstractControl, ValidationErrors } from "@angular/forms";

export class NoWhitespaceValidator {
  static cannotContainSpace(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      if (control && control.value && !control.value.replace(/\s/g, '').length) {
        if ((control.value as string).indexOf(' ') >= 0) {
          resolve({ cannotContainSpace: true });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }
} 
