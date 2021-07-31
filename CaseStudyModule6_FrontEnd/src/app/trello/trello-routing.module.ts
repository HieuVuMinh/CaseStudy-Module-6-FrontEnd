import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TrelloViewComponent} from "./trello-view/trello-view.component";

const routes: Routes = [
  {
    path: '',
    component: TrelloViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrelloRoutingModule { }
