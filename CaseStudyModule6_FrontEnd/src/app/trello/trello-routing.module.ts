import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TrelloViewComponent} from "./trello-view/trello-view.component";
import {TrelloHomeComponent} from "./trello-home/trello-home.component";
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
    path: 'information',
    component: UserInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrelloRoutingModule { }
