import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./helper/auth-guard";
import {SignUpComponent} from "./sign-up/sign-up.component";

const routes: Routes = [
  {
    path: 'trello',
    canActivate: [AuthGuard],
    loadChildren: () => import('./trello/trello.module').then(module => module.TrelloModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
