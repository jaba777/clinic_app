import { Component, OnInit } from '@angular/core';

import { AuthScreenService } from '../Services/auth-screen.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CategoryServiceService } from '../Services/category-service.service';
import { CookieServiceService } from '../Services/cookie-service.service';
import { UserServiceService } from '../Services/user-service.service';

interface Option {
  id: number;
  name: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  myControl = new FormControl('');

  options: any[] = [];
  currentPage = 1;
  isLoading = false;
  page: number = 1;
  filteredOptions!: Observable<Option[]>;

  constructor(
    public authScreenService: AuthScreenService,
    private category: CategoryServiceService,
    public cookieServiceService: CookieServiceService,
    public userServiceService: UserServiceService
  ) {}

  profile: any = {};

  ngOnInit() {
    if (typeof window != 'undefined') {
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

      const userId = this.cookieServiceService.getCookie('userId');

      if (userId) {
        this.userServiceService.MyProfile(userId).subscribe((response) => {
          this.userServiceService.myUser = response.my_profile;
        });
      }
    }
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    this.myControl.setValue(selectedOption.name);
  }
}
