import { NgModule } from '@angular/core';
import { EditDoctorComponent } from './edit-doctor.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [{ path: '', component: EditDoctorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDoctorRoutingModule {}
