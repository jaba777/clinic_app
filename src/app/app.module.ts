import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SignUpModule } from './sign-up/sign-up.module';
import { authorisationInterceptor } from './authorisation.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthorizationComponent } from './authorization/authorization.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AuthorizationComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, SignUpModule, ReactiveFormsModule],
  providers: [
    provideClientHydration(),
    CookieService,
    provideHttpClient(withInterceptors([authorisationInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
