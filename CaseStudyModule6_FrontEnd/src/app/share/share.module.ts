import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarBoardHeaderComponent } from './navbar-board-header/navbar-board-header.component';

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarBoardHeaderComponent
  ],
  exports: [
    NavbarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ShareModule { }
