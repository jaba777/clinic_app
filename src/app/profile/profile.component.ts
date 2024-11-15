import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../Services/user-service.service';
import { format, eachDayOfInterval, addDays } from 'date-fns';
import { Times } from '../models/Times';
import { BookingServiceService } from '../Services/booking-service.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(
    public userServiceService: UserServiceService,
    private bookingServiceService: BookingServiceService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}
  user = {};
  weeks: any = [];
  weeksIndex = 1;
  countOfWeeks = 1;
  time = Times;
  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth() + 1;
  getMonth: string | null = null;
  bookingWeek: any = [];
  totalCount: number = 0;
  bookId: number | null = null;
  removeBookingScreen = false;
  bookTime = {
    time: null,
    date: '',
  };
  myId: number | null = null;
  countOfWeek: number = 1;
  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.myId = userId;

    this.updateWeeks();
    this.findBooks(this.firstElement, this.lastElement, Number(userId));
    this.getCount(Number(userId));
  }
  firstElement = '';
  lastElement = '';
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

  getCount(userId: number) {
    this.bookingServiceService.GetBookCount(userId).subscribe((item: any) => {
      this.totalCount = item.books;
    });
  }

  findBooks(startDate: string, endDate: string, userId: number) {
    this.bookingServiceService
      .GetBooks(startDate, endDate, userId)
      .subscribe((response: any) => {
        this.bookingWeek = response.books;
      });
  }
  growWeekIndex() {
    if (this.weeksIndex < this.countOfWeeks) {
      this.weeksIndex++;
      this.updateWeeks();
      this.findBooks(
        this.firstElement,
        this.lastElement,
        this.userServiceService.myUser.id
      );
    }
  }

  getBookId(day: any, time: string) {
    const book = this.bookingWeek.find(
      (item: any) => item.day === day && item.time === time
    );
    if (book) {
      this.bookId = book.id;
    }
    this.removeBookingScreen = true;
  }

  LowWeekIndex() {
    if (this.weeksIndex > 1) {
      this.weeksIndex--;
      this.updateWeeks();
      this.findBooks(
        this.firstElement,
        this.lastElement,
        this.userServiceService.myUser.id
      );
    }
  }

  removeBooking() {
    if (this.userServiceService.myUser.id) {
      this.bookingServiceService
        .RemoveBook(this.bookId, this.userServiceService.myUser.id)
        .subscribe((item) => {
          this.removeBookingScreen = false;
          if (item.success === true) {
            this.bookingWeek = this.bookingWeek.filter(
              (item: any) => item.id !== this.bookId
            );
            this.totalCount--;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: item.message,
            });
          }
        });
    }
  }

  removeBookings() {
    if (this.userServiceService.myUser.id) {
      this.bookingServiceService
        .RemoveBooks(this.myId, this.firstElement, this.lastElement)
        .subscribe({
          next: (item) => {
            if (item.success === true) {
              this.totalCount -= this.bookingWeek.length;
              this.bookingWeek = [];
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: item.message,
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

  isDayBooked(day: any, time: string): boolean {
    const isBooked = this.bookingWeek.find(
      (item: any) => item.day === day && item.time === time
    );
    return isBooked ? isBooked : null;
  }
  onRemoveBooking() {
    this.removeBookingScreen = false;
  }

  allowDrop(ev: DragEvent): void {
    ev.preventDefault();
  }

  drag(ev: DragEvent, bookingId: any): void {
    ev.dataTransfer?.setData('text', (ev.target as HTMLElement).id);
    ev.dataTransfer?.setData('bookingId', bookingId.id);
    if (this.userServiceService.myUser.role === 'user') {
      ev.dataTransfer?.setData('receiverId', bookingId.doctor_id);
    } else if (this.userServiceService.myUser.role === 'doctor') {
      ev.dataTransfer?.setData('receiverId', bookingId.user_id);
    }
  }

  drop(ev: DragEvent, col: any, row: any): void {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData('text');
    const bookingId = ev.dataTransfer?.getData('bookingId');
    const receiverId = ev.dataTransfer?.getData('receiverId');
    const findIndex = this.bookingWeek.findIndex(
      (item: any) => item.id == bookingId
    );

    this.bookTime = {
      time: row,
      date: `${col.year}-${col.month}-${col.day}`,
    };

    this.bookingServiceService
      .UpdateBooking(
        this.bookTime,
        bookingId as string,
        this.myId,
        receiverId as string
      )
      .subscribe({
        next: (result) => {
          this.bookingWeek[findIndex] = result.book;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: result.message,
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
