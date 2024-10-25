import { Component } from '@angular/core';
import { AuthScreenService } from '../Services/auth-screen.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public authScreenService: AuthScreenService) {}
}
