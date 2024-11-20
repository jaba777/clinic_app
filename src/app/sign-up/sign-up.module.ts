import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    ReactiveFormsModule,
    ToastModule,
    ProgressSpinnerModule,
    GoogleSigninButtonModule,
  ],
})
export class SignUpModule {}
