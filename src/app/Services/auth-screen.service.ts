import { Injectable, OnInit } from '@angular/core';
import { LocalService } from './localService.service';

@Injectable({
  providedIn: 'root',
})
export class AuthScreenService implements OnInit {
  isSignin: any;
  constructor(private localService: LocalService) {}

  ngOnInit(): void {
    const isSignInLocal = this.localService.getLocalstorage('isSignIn');
    if (isSignInLocal) {
      this.isSignin = JSON.parse(isSignInLocal);
      console.log('sasas', JSON.parse(isSignInLocal));
    }
  }

  removeSignScreen() {
    this.isSignin = false;
    this.localService.setInStorage('isSignIn', JSON.stringify(false));
  }
  addSignScreen() {
    this.isSignin = true;
    this.localService.setInStorage('isSignIn', JSON.stringify(true));
  }
}
