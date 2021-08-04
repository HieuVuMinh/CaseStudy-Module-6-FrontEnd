import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrelloRoutingModule } from './trello-routing.module';
import {TrelloViewComponent} from "./trello-view/trello-view.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ShareModule} from "../share/share.module";
import { TrelloHomeComponent } from './trello-home/trello-home.component';

import { TrelloAddComponent } from './trello-add/trello-add.component';
import {WorkspaceBoardComponent} from "./workspace/workspace-board/workspace-board.component";
import {WorkspaceMemberComponent} from "./workspace/workspace-member/workspace-member.component";
import { AddBoardComponent } from './workspace/add-board/add-board.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TrelloViewComponent,
    TrelloHomeComponent,
    TrelloAddComponent,
    WorkspaceBoardComponent,
    WorkspaceMemberComponent,
    AddBoardComponent,
  ],
    imports: [
        CommonModule,
        TrelloRoutingModule,
        DragDropModule,
        ShareModule,
        FormsModule,
    ]
})
export class TrelloModule { }
