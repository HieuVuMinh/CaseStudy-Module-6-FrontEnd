import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrelloViewComponent} from "./trello/trello-view/trello-view.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./helper/auth-guard";

const routes: Routes = [
  {
    path: 'trello',
    canActivate: [AuthGuard],
    loadChildren: () => import('./trello/trello.module').then(module => module.TrelloModule)
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
