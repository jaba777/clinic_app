import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorSignUpComponent } from './doctor-sign-up.component';

const routes: Routes = [{ path: '', component: DoctorSignUpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorSignUpRoutingModule {}
