import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../Services/authService.service';
import { CategoryServiceService } from '../Services/category-service.service';
import { Observable } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CookieServiceService } from '../Services/cookie-service.service';
import { MessageService } from 'primeng/api';

interface Option {
  id: number;
  name: string;
}

@Component({
  selector: 'app-doctor-sign-up',
  templateUrl: './doctor-sign-up.component.html',
  styleUrl: './doctor-sign-up.component.scss',
})
export class DoctorSignUpComponent implements OnInit {
  signUpForm: any;
  localEmail: any = '';
  selectedPhoto: File | null = null;
  selectedResume: File | null = null;

  myControl = new FormControl('');

  options: any[] = [];
  currentPage = 1;
  isLoading = false;
  page: number = 1;
  filteredOptions!: Observable<Option[]>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private category: CategoryServiceService,
    private cookieServiceService: CookieServiceService,
    private messageService: MessageService
  ) {}

  otp: string = '';
  isOtp = false;
  categoryNumber: string | null = null;
  userId: any = null;
  message: string | null = null;

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
    });
    if (typeof window != 'undefined') {
      this.userId = this.cookieServiceService.getCookie('userId');
      this.filterOptions();
    }
  }

  filterOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        this.category.FindCategory(query as string, this.currentPage).pipe(
          map((response) => {
            this.page = response.page;
            return response.result.categories || [];
          })
        )
      )
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    this.categoryNumber = selectedOption.id.toString();
    this.myControl.setValue(selectedOption.name);
  }

  loading: boolean = true;

  onFileSelected(event: Event, type: 'photo' | 'resume') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      type === 'photo'
        ? (this.selectedPhoto = file)
        : (this.selectedResume = file);
    }
  }

  signUp() {
    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.signUpForm.get('name')?.value);
    formData.append('surname', this.signUpForm.get('surname')?.value);
    formData.append('email', this.signUpForm.get('email')?.value);
    formData.append(
      'private_number',
      this.signUpForm.get('private_number')?.value
    );
    formData.append('password', this.signUpForm.get('password')?.value);
    if (this.categoryNumber)
      formData.append('category_id', this.categoryNumber);
    if (this.selectedPhoto) formData.append('photo', this.selectedPhoto);
    if (this.selectedResume) formData.append('resume', this.selectedResume);

    if (this.signUpForm.valid && this.selectedPhoto && this.selectedResume) {
      this.authService.DoctorSignUp(formData, this.userId).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          this.loading = false;
        },
        error: (err) => {
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
