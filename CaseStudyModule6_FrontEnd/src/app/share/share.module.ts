import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarBoardHeaderComponent } from './navbar-board-header/navbar-board-header.component';
import { ModalComponent } from './modal/modal.component';
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
<<<<<<< HEAD
import { FooterComponent } from './footer/footer.component';
=======
>>>>>>> 2f14f1c2806b2db6b88bf3c26ab403a8d9f22fdf

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarBoardHeaderComponent,
    ModalComponent,
    FooterComponent
  ],
  exports: [
    NavbarComponent,
    NavbarBoardHeaderComponent,
    ModalComponent,
    FooterComponent
  ],
<<<<<<< HEAD
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
=======
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ]
>>>>>>> 2f14f1c2806b2db6b88bf3c26ab403a8d9f22fdf
})
export class ShareModule { }
