import { Component, OnInit } from '@angular/core';
import {WorkspaceService} from "../../../service/workspace.service";
import {UserService} from "../../../service/user/user.service";
import {ActivatedRoute} from "@angular/router";
import {Workspace} from "../../../model/workspace";
import {User} from "../../../model/user";
import {UserToken} from "../../../model/user-token";
import {AuthenticationService} from "../../../service/authentication/authentication.service";

@Component({
  selector: 'app-workspace-member',
  templateUrl: './workspace-member.component.html',
  styleUrls: ['./workspace-member.component.scss']
})
export class WorkspaceMemberComponent implements OnInit {
  workspace: Workspace = {type: "", boards: [], id: 0, members: [], owner: undefined, title: ""};
  userList = true;
  users: User[] = [];
  addUserList: User[] = [];
  user: User = {};
  currentUser: UserToken = this.authenticationService.getCurrentUserValue();
  constructor(private workspaceService: WorkspaceService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const id = paramMap.get('id')
      if (id != null) {
        this.findById(id)
      }
    });
  }

  public findById(id: any): void {
    this.workspaceService.findById(id).subscribe(workspaces => {
      this.workspace = workspaces
    })
  }
  public findAllUserByUsername(keyword: string): void {
    this.userList = true;
    this.user.username = keyword;
    if (keyword != "") {
      this.userService.findUsersByKeyword(keyword).subscribe(users => {

        for (let member of this.workspace.members){
          for (let user of users){
                if (member.id == user.id){
                  users.splice(users.indexOf(user),1)
                }
          }
        }
        for (let member of this.addUserList){
          for (let user of users){
            if (member.id == user.id){
              users.splice(users.indexOf(user),1)
            }
          }
        }

        this.users = users;

      })
    } else if (keyword == "") {
      this.users = []
    }
  }

  public updateWorkspace() {
    if (this.addUserList.length > 0){
      for (let user of this.addUserList) {
        this.workspace.members.push(user)
      }
    }
    this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => this.addUserList = [])

  }

  public selectUser(username: any, user: User) {
        username.value = ""
        this.userList = false
        this.addUserList.push(user)
  }

  public removeUserAdded(i: number) {
    this.addUserList.splice(i, 1)
  }
  public removeMembers(i: number) {
    this.workspace.members.splice(i,1)
    this.updateWorkspace()
  }
  public showModal(){
    // @ts-ignore
    document.getElementById("modal-add-member").classList.add("is-active");
  }
  public hideModal(){
    // @ts-ignore
    document.getElementById("modal-add-member").classList.remove("is-active");
  }
}
