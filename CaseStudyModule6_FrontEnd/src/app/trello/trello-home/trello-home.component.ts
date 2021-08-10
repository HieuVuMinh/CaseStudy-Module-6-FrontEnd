import { Component, OnInit } from '@angular/core';
import {Board} from "../../model/board";
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {BoardService} from "../../service/board/board.service";
import {Workspace} from "../../model/workspace";

import {ModalService} from "../../service/modal/modal.service";
import {WorkspaceService} from "../../service/workspace.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-trello-home',
  templateUrl: './trello-home.component.html',
  styleUrls: ['./trello-home.component.scss']
})
export class TrelloHomeComponent implements OnInit {
  currentUser: UserToken = {};
  yourBoards: Board[] = [];
  sharedBoards: Board[] = [];
  workspaces: Workspace[] = [];
  workspace: Workspace = {boards: [], id: 0, members: [], owner: undefined, title: "", type: ""};
  constructor(private authenticationService: AuthenticationService,
              private boardService: BoardService,
              private modalService: ModalService,
              private workspaceService: WorkspaceService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCurrentUserValue();
    this.getYourBoards();
    this.getSharedBoards();
    this.getAllWorkspace()
  }


  private getSharedBoards() {
    this.boardService.findAllSharedBoardsByUserId(this.currentUser.id).subscribe(boards => this.sharedBoards = boards);
  }

  private getYourBoards() {
    this.boardService.findAllOwnedBoardsByUserId(this.currentUser.id).subscribe(boards => {
      this.yourBoards = boards;
    });
  }

  private getAllWorkspace() {
    this.workspaceService.findAllByOwnerId(<number>this.authenticationService.getCurrentUserValue().id).subscribe(workspaces => {
        this.workspaces = workspaces;
      })
  }

  showAddBoardModal() {
    this.modalService.show();
  }
  showAddWorkspaceModal() {
    // @ts-ignore
    document.getElementById('create-workspace').classList.add('is-active');
  }
  hideAddWorkspaceModal() {
    // @ts-ignore
    document.getElementById('create-workspace').classList.remove('is-active');
  }

  createWorkspaces(){
      this.workspace.owner = this.currentUser
      this.hideAddWorkspaceModal()
    this.workspaceService.create(this.workspace).subscribe((workspaces) => {
        this.getAllWorkspace()
        this.router.navigateByUrl(`/trello/workspaces/${workspaces.id}`)
      })
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView();
  }
}
