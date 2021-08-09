import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrelloRoutingModule } from './trello-routing.module';
import {TrelloViewComponent} from "./trello-view/trello-view.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ShareModule} from "../share/share.module";
import { TrelloHomeComponent } from './trello-home/trello-home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WorkspaceBoardComponent} from "./workspace/workspace-board/workspace-board.component";
import {WorkspaceMemberComponent} from "./workspace/workspace-member/workspace-member.component";

@NgModule({
  declarations: [
    TrelloViewComponent,
    TrelloHomeComponent,
    WorkspaceBoardComponent,
    WorkspaceMemberComponent,
  ],
  imports: [
    CommonModule,
    TrelloRoutingModule,
    DragDropModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TrelloModule { }
