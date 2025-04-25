import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NewToastrService {

  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string) {
    this.showNotification(message, 'success');
  }

  showError(message: string) {
    this.showNotification(message, 'error');
  }

  showWarning(message: string) {
    this.showNotification(message, 'warning');
  }

  showInfo(message: string) {
    this.showNotification(message, 'info');
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.notificationSubject.next({ message, type });
  }
}
