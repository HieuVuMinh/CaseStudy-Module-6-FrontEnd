import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {NavbarBoardHeaderComponent} from './navbar-board-header/navbar-board-header.component';
import {RouterModule} from "@angular/router";
import {ModalComponent} from './modal/modal.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarBoardHeaderComponent,
    ModalComponent
  ],
  exports: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class ShareModule {
}
