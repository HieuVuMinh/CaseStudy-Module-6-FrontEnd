import { Component, OnInit } from '@angular/core';
import {WorkspaceService} from "../../../service/workspace.service";
import {UserService} from "../../../service/user/user.service";
import {ActivatedRoute} from "@angular/router";
import {Workspace} from "../../../model/workspace";
import {User} from "../../../model/user";

@Component({
  selector: 'app-workspace-member',
  templateUrl: './workspace-member.component.html',
  styleUrls: ['./workspace-member.component.scss']
})
export class WorkspaceMemberComponent implements OnInit {
  workspace: Workspace = {type: "", boards: [], id: 0, members: [], owner: undefined, title: ""};
  checkMember = true;
  userList = true;
  users: User[] = [];
  addUserList: User[] = [];
  user: User = {};
  constructor(private workspaceService: WorkspaceService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {

  }

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
      console.log(workspaces);
    })
  }
  public findAllUserByUsername(keyword: string): void {
    this.userList = true;
    this.user.username = keyword;
    if (keyword != "") {
      this.userService.findUsersByKeyword(keyword).subscribe(users => {
        this.users = users;
      })
    } else if (keyword == "") {
      this.users = []
    }
  }

  public updateWorkspace() {
    for (let user of this.addUserList) {
      this.workspace.members.push(user)
    }
    this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => console.log("ok"))

  }

  public selectUser(username: any, user: User) {
    if (this.addUserList.length == 0) {
      username.value = ""
      this.userList = false
      this.addUserList.push(user)

    } else {
      this.checkMember = true
      for (let member of this.addUserList) {
        if (member.id == user.id) {
          this.checkMember = false
        }
      }

      if (this.checkMember){
        username.value = ""
        this.userList = false
        this.addUserList.push(user)

      }

    }
  }

  public removeUserAdded(i: number) {
    this.addUserList.splice(i, 1)
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
