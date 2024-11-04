import { Component, OnInit } from '@angular/core';
import { CategoryServiceService } from '../Services/category-service.service';
import { UserServiceService } from '../Services/user-service.service';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { AuthService } from '../Services/authService.service';

interface categories {
  id: number;
  name: string;
  user_count: number;
}

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss',
})
export class DoctorsComponent implements OnInit {
  doctorCategories: categories[] = [];
  private categoryIdSubject = new BehaviorSubject<number | null>(null);
  private pageSubject = new BehaviorSubject<number>(1);
  doctors: any = [];
  totalItems = 1;
  categoryIndex: number = 0;
  doctorId: number | null = null;
  deleteUserScreen = false;
  constructor(
    private categoryServiceService: CategoryServiceService,
    private userServiceService: UserServiceService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.categoryServiceService.AllCategory().subscribe((response) => {
        this.doctorCategories = response.result;
        this.categoryIdSubject.next(response.result[0].id);
      });

      combineLatest([this.categoryIdSubject, this.pageSubject])
        .pipe(
          switchMap(([categoryId, page]) => {
            if (categoryId !== null) {
              return this.userServiceService.FindDoctors(categoryId, page);
            }
            return [];
          })
        )
        .subscribe((doctorResponse) => {
          this.doctors = doctorResponse.my_profile;
          this.totalItems = doctorResponse.totalPages;
        });
    }
  }

  getCategory(category: any, index: number) {
    this.categoryIdSubject.next(category.id);
    this.categoryIndex = index;
  }

  currentPage = 1;

  pageChanged(event: any) {
    this.pageSubject.next(event.pageIndex + 1);
    this.currentPage = event.pageIndex + 1;
  }

  addDeleteScreen(userId: number) {
    this.deleteUserScreen = true;
    this.doctorId = userId;
  }
  removeDeleteScreen() {
    this.deleteUserScreen = false;
  }
  removeUser() {
    this.authService.UserDelete(this.doctorId).subscribe((item) => {
      if (item.success == true) {
        this.doctors = this.doctors.filter(
          (user: any) => user.id != this.doctorId
        );
        this.deleteUserScreen = false;
      }
    });
  }
}
