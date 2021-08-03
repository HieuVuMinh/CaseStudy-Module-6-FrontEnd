import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TrelloViewComponent} from "./trello-view/trello-view.component";
import {TrelloHomeComponent} from "./trello-home/trello-home.component";

const routes: Routes = [
  {
    path: '',
    component: TrelloHomeComponent
  },
  {
    path: 'board',
    component: TrelloViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrelloRoutingModule { }
