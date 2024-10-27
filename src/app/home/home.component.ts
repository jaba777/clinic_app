import { Component, OnInit } from '@angular/core';
import { CategoryServiceService } from '../Services/category-service.service';

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
  constructor(private categoryServiceService: CategoryServiceService) {}
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.categoryServiceService.AllCategory().subscribe((response) => {
        console.log(response.result);
        this.doctorCategories = response.result;
      });
    }
  }
}
