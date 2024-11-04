import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDoctorComponent } from './edit-doctor.component';
import { EditDoctorRoutingModule } from './edit-doctor-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [EditDoctorComponent],
  imports: [
    CommonModule,
    EditDoctorRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
})
export class EditDoctorModule {}
