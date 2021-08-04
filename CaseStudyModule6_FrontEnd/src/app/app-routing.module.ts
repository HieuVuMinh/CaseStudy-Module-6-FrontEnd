import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./helper/auth-guard";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {RecoverPasswordComponent} from "./recoverPassword/recover-password.component";
import {WorkspaceComponent} from "./trello/workspace/workspace.component";

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
  },
  {
    path: 'recoverpassword',
    component: RecoverPasswordComponent
  },
  {
    path: 'workspaces/:id',
    component: WorkspaceComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
