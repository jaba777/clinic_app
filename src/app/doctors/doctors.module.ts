import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsRoutingModule } from './doctors-routing.module';
import { DoctorsComponent } from './doctors.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [DoctorsComponent],
  imports: [
    CommonModule,
    DoctorsRoutingModule,
    NgxPaginationModule,
    MatPaginatorModule,
    ToastModule,
  ],
})
export class DoctorsModule {}
