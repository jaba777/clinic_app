import { Component, OnInit } from '@angular/core';
import { CategoryServiceService } from '../Services/category-service.service';
import { UserServiceService } from '../Services/user-service.service';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

interface categories {
  id: number;
  name: string;
  user_count: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  doctorCategories: categories[] = [];
  categoryId: number | null = null;
  page = 1;
  private categoryIdSubject = new BehaviorSubject<number | null>(null);
  private pageSubject = new BehaviorSubject<number>(1);
  dictors: any = [];
  constructor(
    private categoryServiceService: CategoryServiceService,
    private userServiceService: UserServiceService
  ) {}

  profession: string | null = null;
  categoryIndex: number = 0;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.categoryServiceService.AllCategory().subscribe((response) => {
        this.categoryId = response.result[0].id;
        this.doctorCategories = response.result;

        this.categoryIdSubject.next(response.result[0].id);
        this.profession = response.result[0].name;
      });
      combineLatest([this.categoryIdSubject, this.pageSubject])
        .pipe(
          switchMap(([categoryId, page]) => {
            if (categoryId !== null) {
              return this.userServiceService.FindDoctors(categoryId, page);
            }
            return []; // Handle if categoryId is null
          })
        )
        .subscribe((doctorResponse) => {
          console.log('Doctor Response:', doctorResponse.my_profile);
          this.dictors = doctorResponse.my_profile;
        });
    }
  }
  getCategory(category: any, index: number) {
    this.categoryIdSubject.next(category.id);
    this.categoryId = category.id;
    console.log(category);
    this.profession = category.name as string;
    this.categoryIndex = index;
  }
}
