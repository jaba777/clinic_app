import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorSignUpComponent } from './doctor-sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DoctorSignUpRoutingModule } from './doctor-sign-up-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [DoctorSignUpComponent, SpinnerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DoctorSignUpRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ToastModule,
  ],
})
export class DoctorSignUpModule {}
