import { Component, OnInit } from '@angular/core';
import {Workspace} from "../../model/workspace";
import {User} from "../../model/user";
import {WorkspaceService} from "../../service/workspace.service";
import {UserService} from "../../service/user/user.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  workspace: Workspace = {boards: [], id: 0, owner: undefined, title: "", users: []};
  user: User = {};
  checkUser = true;
  userList = true;
  users: User[] = [];
  addUserList: User[] = [];

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

  public findAllUserByUsername(username: string): void {
    this.userList = true;
    this.user.username = username;
    if (username != "" ){
      this.userService.findAllByUsername(username).subscribe(users => {
        this.users = users;
      })
    } else if (username == ""){
        this.users = []
    }
  }

  public update() {
    this.userService.findByUsername(<string>this.user.username).subscribe(user => {
      this.workspace.users.push(user)
      this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => console.log("ok") , () => this.checkUser = false)
    })

  }

  public selectUser(username: any, user: User){
    this.userList = false
    username.value = user.username
    this.addUserList.push(user)
  }

  public removeUserAdded(i: number){
    this.addUserList.splice(i, 1)
  }

}

