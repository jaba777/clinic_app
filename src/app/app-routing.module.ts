import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardGuard } from './guards/admin-guard.guard';
import { UserGuardGuard } from './guards/user-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
  {
    path: 'doctor-register',
    loadChildren: () =>
      import('./doctor-sign-up/doctor-sign-up.module').then(
        (m) => m.DoctorSignUpModule
      ),
    canActivate: [AdminGuardGuard],
  },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [UserGuardGuard],
  },
  {
    path: 'user/:id',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'doctors',
    loadChildren: () =>
      import('./doctors/doctors.module').then((m) => m.DoctorsModule),
    canActivate: [AdminGuardGuard],
  },
  {
    path: 'edit-doctor/:id',
    loadChildren: () =>
      import('./edit-doctor/edit-doctor.module').then(
        (m) => m.EditDoctorModule
      ),
    canActivate: [AdminGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
