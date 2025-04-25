import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  private userBusinessRole: any[] = [];

  constructor() {}

  // Helper method to set a value in sessionStorage
  private setSessionStorage(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  // Helper method to get a value from sessionStorage
  private getSessionStorage(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  // General method to get a value, returns empty string if not found
  getValue(key: string): string {
    const value = this.getSessionStorage(key);
    return value !== null && value !== 'undefined' ? value : '';
  }

  // Set a value in sessionStorage by key
  setValue(key: string, value: any): void {
    this.setSessionStorage(key, value);
  }

  // Set business roles and handle sessionStorage storage
  setBusinessRole(value: any): void {
    if (value?.userBusinessRole?.length > 0) {
      // Merge new roles with the existing roles
      this.userBusinessRole = [
        ...this.userBusinessRole,
        ...value.userBusinessRole,
      ];

      // Store in sessionStorage
      this.setSessionStorage('userBusinessRole', value.userBusinessRole);
      this.setSessionStorage(
        'UserBusinessId',
        value.userBusinessRole[0]?.BusinessUnitId
      );
      this.setSessionStorage('Capacity', value.userBusinessRole[0]?.Capacity);
    }
  }

  // Store business ID in sessionStorage
  setUserBusinessId(value: any): void {
    this.setSessionStorage('UserBusinessId', value);
  }

  // Store capacity in sessionStorage
  setUserCapasity(value: any): void {
    this.setSessionStorage('Capacity', value);
  }

  // Get capacity from sessionStorage
  getCapacity(): string | null {
    return this.getSessionStorage('Capacity');
  }

  // Get user business ID from sessionStorage
  getUserBusinessId(): string | null {
    return this.getSessionStorage('UserBusinessId');
  }

  // Get business roles from sessionStorage
  GetBusinessRole(): string | null {
    return this.getSessionStorage('userBusinessRole');
  }

  // Remove a specific key from sessionStorage
  removeValue(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clear all values from sessionStorage
  clearStorage(): void {
    sessionStorage.clear();
  }
}
