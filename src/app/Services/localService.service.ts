import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor() {}
  getLocalstorage(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null; // or handle as needed for SSR
  }
  setInStorage(name: string, stringify: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, stringify);
    }
  }
  deleteLocalStorage(name: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  }
}
