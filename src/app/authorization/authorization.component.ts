import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthScreenService } from '../Services/auth-screen.service';
import { LocalService } from '../Services/localService.service';
import { AuthService } from '../Services/authService.service';
import { CookieServiceService } from '../Services/cookie-service.service';
import { UserServiceService } from '../Services/user-service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})
export class AuthorizationComponent implements OnInit {
  signInForm: any;
  authPage = 1;
  emailVerifyForm: any;
  socialAuthService = inject(SocialAuthService);
  constructor(
    private fb: FormBuilder,
    public authScreenService: AuthScreenService,
    private localService: LocalService,
    private authService: AuthService,
    private cookieServiceService: CookieServiceService,
    private userServiceService: UserServiceService,
    private router: Router,
    private messageService: MessageService
  ) {}
  isSpinner: boolean = false;

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

    this.emailVerifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
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
    this.socialAuthService.authState.subscribe({
      next: (result) => {
        this.authService.GoogleLogin(result.idToken).subscribe({
          next: (response) => {
            this.cookieServiceService.setCookie('token', response.token);
            this.cookieServiceService.setCookie('userId', response.user.id);
            this.cookieServiceService.setCookie('role', response.user.role);
            this.isSpinner = false;
            this.userServiceService.myUser = response.user;
            this.authScreenService.removeSignScreen();
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 100);
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onAuthorizationClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;

    if (target === currentTarget) {
      this.authScreenService.removeSignScreen();
    }
  }

  SignInFunct() {
    if (this.signInForm.valid) {
      this.isSpinner = true;
      this.authService.SignIn(this.signInForm.value).subscribe({
        next: (response) => {
          this.cookieServiceService.setCookie('token', response.token);
          this.cookieServiceService.setCookie('userId', response.user.id);
          this.cookieServiceService.setCookie('role', response.user.role);
          this.isSpinner = false;
          this.userServiceService.myUser = response.user;
          this.authScreenService.removeSignScreen();
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 100);
        },
        error: (err) => {
          this.isSpinner = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
        },
      });
    }
  }

  VerifyEmail() {
    this.isSpinner = true;
    if (this.emailVerifyForm.get('email').valid) {
      this.authService
        .VerifyEmail(this.emailVerifyForm.get('email').value)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.authPage = 3;
            }

            this.isSpinner = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
            this.isSpinner = false;
          },
        });
    }
  }
  VerifyOtp() {
    this.isSpinner = true;
    if (
      this.emailVerifyForm.get('email').valid &&
      this.emailVerifyForm.get('otp').valid
    ) {
      this.authService
        .VerifyOtp(
          this.emailVerifyForm.get('email').value,
          this.emailVerifyForm.get('otp').value
        )
        .subscribe({
          next: (response) => {
            if (response.success === true) {
              this.authPage = 4;
            }
            this.isSpinner = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
            this.isSpinner = false;
          },
        });
    }
  }

  ChangePassword() {
    this.isSpinner = true;
    if (
      this.emailVerifyForm.get('email').valid &&
      this.emailVerifyForm.get('password').valid
    ) {
      this.authService
        .ChangePassword(
          this.emailVerifyForm.get('email').value,
          this.emailVerifyForm.get('password').value
        )
        .subscribe((response) => {
          if (response.success === true) {
            this.authPage = 1;
          }
          this.isSpinner = false;
        });
    }
  }
}
