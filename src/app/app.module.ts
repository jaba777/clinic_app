import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SignUpModule } from './sign-up/sign-up.module';
import { authorisationInterceptor } from './authorisation.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthorizationComponent } from './authorization/authorization.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomeModule } from './home/home.module';
import { DoctorSignUpModule } from './doctor-sign-up/doctor-sign-up.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EditDoctorModule } from './edit-doctor/edit-doctor.module';
import { ToastModule } from 'primeng/toast';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { environment } from '../enviroments';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AuthorizationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule,
    HomeModule,
    SignUpModule,
    DoctorSignUpModule,
    ProfileModule,
    UsersModule,
    DoctorsModule,
    ProgressSpinnerModule,
    EditDoctorModule,
    ToastModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    provideClientHydration(),
    CookieService,
    provideHttpClient(withInterceptors([authorisationInterceptor])),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.Client_Id, {
              oneTapEnabled: false,
              prompt: 'consent',
            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
