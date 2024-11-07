import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, UsersRoutingModule, DragDropModule],
})
export class UsersModule {}
