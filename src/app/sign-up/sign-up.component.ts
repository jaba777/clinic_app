import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../Services/authService.service';
import { LocalService } from '../Services/localService.service';
import { MessageService } from 'primeng/api';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signUpForm: any;
  localEmail: any = '';
  socialAuthService = inject(SocialAuthService);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localService: LocalService,
    private messageService: MessageService
  ) {}

  otp: string = '';
  isOtp = false;
  isSpinner: boolean = false;

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      surname: ['', [Validators.required, Validators.minLength(5)]],
      private_number: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
        ],
      ],
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
      otp: ['', [Validators.required]],
    });
    const storageemail = this.localService.getLocalstorage('email');
    const islocalOtp = this.localService.getLocalstorage('otp');
    if (storageemail) {
      this.localEmail = JSON.parse(storageemail);
    }
    if (islocalOtp) {
      this.isOtp = JSON.parse(islocalOtp);
    }
  }

  result: any = null;
  loading: boolean = false;

  signUp() {
    if (this.isOtp) {
      this.loading = true;
      return this.authService
        .SignUp({
          email: this.localEmail,
          otp: this.signUpForm.value.otp,
        })
        .subscribe({
          next: (response) => {
            if (response.success == true && response.isRegistered == true) {
              this.localService.deleteLocalStorage('email');
              this.localService.deleteLocalStorage('otp');
              this.isOtp = false;
              this.result = response?.message;
            }
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response?.message,
            });
          },
          error: (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
          },
        });
    } else {
      this.loading = true;
      return this.authService
        .SignUp({
          ...this.signUpForm.value,
          otp: null,
        })
        .subscribe({
          next: (response) => {
            this.localService.setInStorage(
              'email',
              JSON.stringify(response.email)
            );
            this.localEmail = response.email;
            this.localService.setInStorage('otp', JSON.stringify(true));
            this.isOtp = true;
            this.result = response?.message;
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response?.message,
            });
          },
          error: (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
          },
        });
    }
  }
}
