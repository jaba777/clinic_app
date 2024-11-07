import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../Services/user-service.service';
import { Times } from '../models/Times';
import {
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  getDay,
  addDays,
  getMonth,
} from 'date-fns';
import { BookingServiceService } from '../Services/booking-service.service';
import { CookieServiceService } from '../Services/cookie-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  user: any = {};
  weeks: any = [];
  weeksIndex = 1;
  countOfWeeks = 1;
  time = Times;
  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth() + 1;
  getMonth: string | null = null;
  doctorId: number | null = null;
  bookingWeek: any = [];

  countOfWeek: number = 1;
  bookingScreen = false;
  removeBookingScreen = false;
  bookId: number | null = null;

  bookTime = {
    time: null,
    date: '',
  };

  myId: any;

  @Input() logging: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userServiceService: UserServiceService,
    private bookingServiceService: BookingServiceService,
    private cookieServiceService: CookieServiceService
  ) {}
  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    if (typeof window != 'undefined') {
      this.doctorId = Number(userId);
      this.userServiceService
        .getDoctor(userId.toString())
        .subscribe((response) => {
          this.user = response.user;
        });
    }

    this.updateWeeks();
    this.myId = this.cookieServiceService.getCookie('userId');
  }

  firstElement = '';
  lastElement = '';

  weekDays: any;
  updateWeeks() {
    const { endweeks, countOfWeeks } = this.getWeeksOfMonth(this.weeksIndex);
    this.weeks = endweeks;
    this.countOfWeeks = countOfWeeks;
    const month = endweeks[endweeks.length - 1];
    this.lastElement = `${endweeks[endweeks.length - 1].year}-${
      endweeks[endweeks.length - 1].month
    }-${endweeks[endweeks.length - 1].day}`;
    this.firstElement = `${endweeks[0].year}-${endweeks[0].month}-${endweeks[0].day}`;
    const date = new Date(this.thisYear, month.month - 1);
    this.getMonth = format(date, 'MMMM');
    if (this.doctorId) {
      this.findBooks(this.firstElement, this.lastElement, this.doctorId);
    }
  }

  isDayBooked(day: any, time: string): boolean {
    return this.bookingWeek.some(
      (item: any) =>
        item.day === day &&
        item.time === time &&
        item.user_id === Number(this.myId)
    );
  }

  isDayOtherBooked(day: any, time: string): boolean {
    return this.bookingWeek.some(
      (item: any) =>
        item.day === day &&
        item.time === time &&
        item.user_id !== Number(this.myId)
    );
  }

  getWeeksOfMonth(index: number) {
    const start = new Date();
    const end = addDays(start, 30);

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
        year: start.getFullYear(),
      };
    });

    const countOfWeeks = Math.ceil(days.length / 7);

    return { endweeks, countOfWeeks };
  }

  findBooks(startDate: string, endDate: string, doctorId: number) {
    this.bookingServiceService
      .GetBooks(startDate, endDate, doctorId)
      .subscribe((books) => {
        this.bookingWeek = books.books;
      });
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

  getTimes(col: any, row: any) {
    if (col.week !== 'Sat' && col.week !== 'Sun') {
      this.bookTime = {
        time: row,
        date: `${col.year}-${col.month}-${col.day}`,
      };

      this.bookingScreen = true;
    }
  }

  getBookId(day: any, time: string) {
    const book = this.bookingWeek.find(
      (item: any) =>
        item.day === day &&
        item.time === time &&
        item.user_id === Number(this.myId)
    );
    if (book) {
      this.bookId = book.id;
    }

    this.removeBookingScreen = true;
  }

  addBooking() {
    if (this.myId && this.doctorId) {
      this.bookingServiceService
        .AddBooking({
          ...this.bookTime,
          user_id: this.myId,
          doctor_id: this.doctorId,
        })
        .subscribe((item) => {
          if (item.success === true) {
            this.bookingWeek.push(item.book);
          }

          this.bookingScreen = false;
        });
    }
  }

  removeBooking() {
    if (this.myId && this.doctorId) {
      this.bookingServiceService
        .RemoveBook(this.bookId, this.myId)
        .subscribe((item) => {
          if (item.success === true) {
            this.bookingWeek = this.bookingWeek.filter(
              (item: any) => item.id !== this.bookId
            );
          }

          this.removeBookingScreen = false;
        });
    }
  }

  onbookingClick(): void {
    this.bookingScreen = false;
  }
  onRemoveBooking() {
    this.removeBookingScreen = false;
  }
}
