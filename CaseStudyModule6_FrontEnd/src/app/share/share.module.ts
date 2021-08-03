import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarBoardHeaderComponent } from './navbar-board-header/navbar-board-header.component';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarBoardHeaderComponent
  ],
  exports: [
    NavbarComponent
  ],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class ShareModule { }
