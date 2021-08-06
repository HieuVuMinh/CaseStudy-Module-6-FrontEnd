import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {User} from "../../../model/user";
import {WorkspaceService} from "../../../service/workspace.service";
import {UserService} from "../../../service/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Board} from "../../../model/board";
import {ModalService} from "../../../service/modal/modal.service";
import {BoardService} from "../../../service/board/board.service";
import {Member} from "../../../model/member";
import {MemberService} from "../../../service/member/member.service";
import {UserToken} from "../../../model/user-token";
import {AuthenticationService} from "../../../service/authentication/authentication.service";

@Component({
  selector: 'app-workspace-board',
  templateUrl: './workspace-board.component.html',
  styleUrls: ['./workspace-board.component.scss']
})
export class WorkspaceBoardComponent implements OnInit {

  workspace: Workspace = {type: "", boards: [], id: 0, members: [], owner: undefined, title: ""};
  user: User = {};
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
  modalBoard = false;
  modalDelete =false;
  currentUser: UserToken = this.authenticationService.getCurrentUserValue();
  membersDto: Member[] = [];
  roleUserInWorkspace: Boolean = false;

  constructor(private workspaceService: WorkspaceService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              public modalService: ModalService,
              private boardService: BoardService,
              private router: Router,
              private memberService: MemberService,
              private authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(paramMap => {
      const id = paramMap.get('id')
      if (id != null) {
        this.findById(id)
      }
    });
    window.scrollTo(0, 0)
  }


  public findById(id: any): void {
    this.workspaceService.findById(id).subscribe(workspaces => {
      this.workspace = workspaces
      this.checkRole()
    })
  }


  addNewBoard() {
    this.modalService.close();
    this.board.owner.id = this.currentUser.id;
    this.boardService.addNewBoard(this.board).subscribe(board => {
        this.updateWorkspace(board)
        this.board = board;
      for (let member of this.workspace.members) {
        let memberDto: Member = {
          board: this.board,
          canEdit: false,
          user: {
            id: member.user?.id
          }
        }
        this.membersDto.push(memberDto)
      }
      this.addNewMembers();
      }
    )
    this.hideAddBoardModal()
  }


  private addNewMembers() {
    this.memberService.addNewMembers(this.membersDto).subscribe(() => {
      this.router.navigateByUrl(`/trello/boards/${this.board.id}`);
      this.resetInputs();
    })
  }

  resetInputs() {
    this.board = {
      title: '',
      owner: {
        id: -1,
      },
      columns: [],
    };
    this.userSearch = ``;
    this.userResult = [];
    this.members = [];
    this.membersDto = [];
  }

  showAddBoardModal() {
    this.modalBoard = true

  }

  hideAddBoardModal() {
    this.modalBoard = false
  }
  showModalDelete() {
    this.modalDelete = true
  }

  hideModalDelete() {
    this.modalDelete = false
  }

  public updateWorkspace(board: Board) {
    this.workspace.boards.push(board)
    this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => console.log("ok"))

  }

  checkRole() {
    if (this.currentUser.id == this.workspace.owner?.id) {
      this.roleUserInWorkspace = true
    }
    for (let member of this.workspace.members) {
      if ((this.currentUser.id == member.user?.id && member.role == "Admin")) {
        this.roleUserInWorkspace = true
      }
    }
  }

  deleteWorkspace(id: number) {
    this.workspaceService.delete(id).subscribe(() => this.router.navigateByUrl(`/trello`))
  }
}