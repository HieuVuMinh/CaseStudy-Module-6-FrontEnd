import { Component, OnInit } from '@angular/core';
import {WorkspaceService} from "../../../service/workspace.service";
import {UserService} from "../../../service/user/user.service";
import {ActivatedRoute} from "@angular/router";
import {Workspace} from "../../../model/workspace";
import {Board} from "../../../model/board";
import {User} from "../../../model/user";
import {ModalService} from "../../../service/modal/modal.service";

@Component({
  selector: 'app-add-board',
  templateUrl: './add-board.component.html',
  styleUrls: ['./add-board.component.scss']
})
export class AddBoardComponent implements OnInit {
  workspace: Workspace = {type: "", boards: [], id: 0, members: [], owner: undefined, title: ""};
  board: Board = {
    title: '',
    owner: {
      id: -1,
    },
    columns: [],
  };
  userSearch: string = ``;
  userResult: User[] = [];
  members: User[] = [];
  constructor(private workspaceService: WorkspaceService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              public modalService: ModalService,) {

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

  searchUsers() {
    if (this.userSearch != '') {
      this.userService.findUsersByKeyword(this.userSearch).subscribe(users => {
        this.userResult = users;
        this.cleanSearchResults();
      });
    } else {
      this.userResult = [];
    }
  }

  addMember(user: User) {
    this.members.push(user);
    this.userSearch = '';
    this.userResult = [];
  }

  private cleanSearchResults() {
    for (let i = 0; i < this.userResult.length; i++) {
      let result = this.userResult[i];
      let toBeDeleted = false;
      if (result.id == this.modalService.currentUser.id) {
        toBeDeleted = true;
      } else {
        for (let member of this.members) {
          if (result.id == member.id) {
            toBeDeleted = true;
            break;
          }
        }
      }

      if (toBeDeleted) {
        this.userResult.splice(i, 1);
        i--;
      }
    }
  }

  removeMember(memberIndex: number) {
    this.members.splice(memberIndex, 1);
  }

}
