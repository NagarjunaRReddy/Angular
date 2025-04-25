import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private logoUrlSubject = new BehaviorSubject<string>('assets/images/smyrnatruck_blue.png'); // Default logo
  logoUrl$ = this.logoUrlSubject.asObservable(); // Expose the observable

  // Method to set the logo URL, and notify all subscribers
  setLogoUrl(logoUrl: string): void {
    this.logoUrlSubject.next(logoUrl);
  }

  // Optionally, you can have a getter for the current value
  getLogoUrl(): string {
    return this.logoUrlSubject.getValue();
  }
}
