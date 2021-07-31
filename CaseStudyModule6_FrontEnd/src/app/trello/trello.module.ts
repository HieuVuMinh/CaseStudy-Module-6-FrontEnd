import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrelloRoutingModule } from './trello-routing.module';
import {TrelloViewComponent} from "./trello-view/trello-view.component";
import {DragDropModule} from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    TrelloViewComponent
  ],
  imports: [
    CommonModule,
    TrelloRoutingModule,
    DragDropModule,
  ]
})
export class TrelloModule { }
