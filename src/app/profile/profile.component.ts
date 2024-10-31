import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UserServiceService } from '../Services/user-service.service';
import {
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  getDay,
  addDays,
  getMonth,
} from 'date-fns';
import { Times } from '../models/Times';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(public userServiceService: UserServiceService) {}
  weeks: any = [];
  weeksIndex = 1;
  countOfWeeks = 1;
  time = Times;
  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth() + 1;
  getMonth: string | null = null;

  countOfWeek: number = 1;
  ngOnInit(): void {
    this.updateWeeks();
  }

  updateWeeks() {
    const { endweeks, countOfWeeks } = this.getWeeksOfMonth(this.weeksIndex);
    this.weeks = endweeks;
    console.log('weeks', endweeks);
    this.countOfWeeks = countOfWeeks;
    const month = endweeks[endweeks.length - 1];
    const date = new Date(this.thisYear, month.month - 1);

    this.getMonth = format(date, 'MMMM');
  }

  getWeeksOfMonth(index: number) {
    const start = new Date(); // today's date
    const end = addDays(start, 30); // 30 days from today

    const days = eachDayOfInterval({ start, end });

    const startIndex = 7 * (index - 1);
    const endIndex = 7 * index;

    const endweeks = days.slice(startIndex, endIndex).map((date) => {
      const dayNumber = date.getDate();
      const weekDayName = format(date, 'EEE');
      const month = date.getMonth() + 1;

      return {
        day: dayNumber,
        week: weekDayName,
        month,
      };
    });

    const countOfWeeks = Math.ceil(days.length / 7);

    return { endweeks, countOfWeeks };
  }
  growWeekIndex() {
    if (this.weeksIndex < this.countOfWeeks) {
      this.weeksIndex++;
      this.updateWeeks();
    }
  }

  LowWeekIndex() {
    if (this.weeksIndex > 1) {
      this.weeksIndex--;
      this.updateWeeks();
    }
  }
}
