import { Component, OnInit } from '@angular/core';
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
  showModal = false;
  currentUser: UserToken = this.authenticationService.getCurrentUserValue();
  membersDto: Member[] = [];
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
  addNewBoard() {
    this.modalService.close();
    //create new board
    this.board.owner.id = this.currentUser.id;
    this.boardService.addNewBoard(this.board).subscribe(board => {
      this.updateWorkspace(board)
        this.board = board;
        this.loadDto();
      }
    )
  }

  removeMember(memberIndex: number) {
    this.members.splice(memberIndex, 1);
  }

  private loadDto() {
    for (let member of this.members) {
      let memberDto: Member = {
        board: this.board,
        canEdit: false,
        user: {
          id: member.id
        }
      }
      this.membersDto.push(memberDto)
    }
    this.addNewMembers();
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
    this.showModal = true
  }
  hideAddBoardModal(){
    this.showModal = false
  }
  public updateWorkspace(board: Board) {
    this.workspace.boards.push(board)
    this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => console.log("ok"))

  }

}
