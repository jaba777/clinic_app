import { Component } from '@angular/core';
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
import { UserServiceService } from '../Services/user-service.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

interface Option {
  id: number;
  name: string;
}
@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrl: './edit-doctor.component.scss',
})
export class EditDoctorComponent {
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
    private userServiceService: UserServiceService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  otp: string = '';
  isOtp = false;
  categoryNumber: string | null = null;
  userId: any = null;
  message: string | null = null;
  photo = '';
  photoPreview: any = null;

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
      password: [''],
    });

    const userId = this.route.snapshot.params['id'];
    if (typeof window != 'undefined') {
      this.userId = userId;
      this.filterOptions();
      this.userServiceService
        .getDoctor(userId.toString())
        .subscribe((response) => {
          this.signUpForm.patchValue({
            name: response.user.name,
            surname: response.user.surname,
            private_number: response.user.private_number,
            email: response.user.email,
          });

          this.photo = response.user.photo;

          const selectedOption = response.user.category;
          this.categoryNumber = selectedOption.id.toString();
          this.myControl.setValue(selectedOption.name);
        });
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
    console.log('event', (event.target as HTMLInputElement).files);
    if (file) {
      if (type === 'photo') {
        this.selectedPhoto = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreview = e.target?.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedResume = file;
      }
    }
  }

  EditProfile() {
    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.signUpForm.get('name')?.value);
    formData.append('surname', this.signUpForm.get('surname')?.value);
    formData.append('email', this.signUpForm.get('email')?.value);
    formData.append(
      'private_number',
      this.signUpForm.get('private_number')?.value
    );
    const password = this.signUpForm.get('password')?.value;
    if (password !== null && password !== '') {
      formData.append('password', password);
    }
    if (this.categoryNumber)
      formData.append('category_id', this.categoryNumber);
    if (this.selectedPhoto) formData.append('photo', this.selectedPhoto);
    if (this.selectedResume) formData.append('resume', this.selectedResume);

    this.authService.DoctorEdit(formData, this.userId).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
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
