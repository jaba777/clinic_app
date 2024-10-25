import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthScreenService } from '../Services/auth-screen.service';
import { LocalService } from '../Services/localService.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})
export class AuthorizationComponent implements OnInit {
  signInForm: any;

  constructor(
    private fb: FormBuilder,
    public authScreenService: AuthScreenService,
    private localService: LocalService
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-]).{8,16}$'
          ),
        ],
      ],
    });

    const isSignInLocal = this.localService.getLocalstorage('isSignIn');
    if (isSignInLocal) {
      this.authScreenService.isSignin = JSON.parse(isSignInLocal);
    }
  }
  onAuthorizationClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;

    if (target === currentTarget) {
      this.authScreenService.removeSignScreen();
    }
  }
}
