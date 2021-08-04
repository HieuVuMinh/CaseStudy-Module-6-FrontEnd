import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TrelloViewComponent} from "./trello-view/trello-view.component";
import {TrelloHomeComponent} from "./trello-home/trello-home.component";
import {WorkspaceBoardComponent} from "./workspace/workspace-board/workspace-board.component";
import {WorkspaceMemberComponent} from "./workspace/workspace-member/workspace-member.component";

import {UserInformationComponent} from "./user-information/user-information.component";

const routes: Routes = [
  {
    path: '',
    component: TrelloHomeComponent
  },
  {
    path: 'boards/:id',
    component: TrelloViewComponent
  },
  {
    path: 'workspaces/:id',
    component: WorkspaceBoardComponent
  },
  {
    path: 'workspaces/:id/members',
    component: WorkspaceMemberComponent
  },
  {
    path: 'information',
    component: UserInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrelloRoutingModule { }
