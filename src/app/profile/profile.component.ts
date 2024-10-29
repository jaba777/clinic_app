import { Component } from '@angular/core';
import { UserServiceService } from '../Services/user-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(public userServiceService: UserServiceService) {}
}
