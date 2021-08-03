import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrelloRoutingModule } from './trello-routing.module';
import {TrelloViewComponent} from "./trello-view/trello-view.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ShareModule} from "../share/share.module";
import { TrelloHomeComponent } from './trello-home/trello-home.component';


@NgModule({
  declarations: [
    TrelloViewComponent,
    TrelloHomeComponent
  ],
  imports: [
    CommonModule,
    TrelloRoutingModule,
    DragDropModule,
    ShareModule,
  ]
})
export class TrelloModule { }
