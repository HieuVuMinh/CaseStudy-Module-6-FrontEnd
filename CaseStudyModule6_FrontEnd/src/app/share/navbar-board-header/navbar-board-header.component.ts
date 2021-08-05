import {Component, Input, OnInit} from '@angular/core';
import {Board} from "../../model/board";
import {DetailedMember} from "../../model/detailed-member";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {User} from "../../model/user";
import {UserService} from "../../service/user/user.service";
import {Member} from "../../model/member";
import {MemberService} from "../../service/member/member.service";

@Component({
  selector: 'app-navbar-board-header',
  templateUrl: './navbar-board-header.component.html',
  styleUrls: ['./navbar-board-header.component.scss']
})
export class NavbarBoardHeaderComponent implements OnInit {
  @Input() board: Board = {columns: [], owner: {}, title: ""}
  @Input() members: DetailedMember[] = [];
  searchBarIsShown: boolean = false;
  userSearch: string = ``;
  userResult: User[] = [];
  selectedMember: DetailedMember = {boardId: -1, canEdit: false, id: -1, userId: -1, username: ""};

  constructor(public authenticationService: AuthenticationService,
              private userService: UserService,
              private memberService: MemberService) {
  }

  ngOnInit(): void {
  }


  toggleUserSearchBar() {
    this.searchBarIsShown = !this.searchBarIsShown;
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

  private cleanSearchResults() {
    for (let i = 0; i < this.userResult.length; i++) {
      let result = this.userResult[i];
      let toBeDeleted = false;
      if (result.id == this.board.owner.id) {
        toBeDeleted = true;
      } else {
        for (let member of this.members) {
          if (result.id == member.userId) {
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

  addMember(result: User) {
    let member: Member = {
      board: this.board,
      canEdit: false,
      user: result
    }
    this.memberService.addNewMember(member).subscribe(() => {
      this.resetSearch();
      this.getMembers();
    });
  }

  private resetSearch() {
    this.searchBarIsShown = false;
    this.userSearch = ``;
    this.userResult = [];
  }

  private getMembers() {
    this.memberService.getMembersByBoardId(this.board.id).subscribe(members => this.members = members);
  }

  showDetail(member: DetailedMember) {
    this.selectedMember = member;
    // @ts-ignore
    document.getElementById('user-detail-modal').classList.add('is-active');
  }

  closeModal() {
    // @ts-ignore
    document.getElementById('user-detail-modal').classList.remove('is-active');
  }

  removeSelectedMember() {
    this.memberService.deleteMember(this.selectedMember.id).subscribe(() => {
      this.getMembers();
      this.closeModal();
    });
  }

  makeSelectedMemberEditor() {
    this.selectedMember.canEdit = true;
    this.updateSelectedMember();
  }

  makeSelectedMemberObserver() {
    this.selectedMember.canEdit = false;
    this.updateSelectedMember();
  }

  updateSelectedMember() {
    let member: Member = {
      board: this.board,
      canEdit: this.selectedMember.canEdit,
      id: this.selectedMember.id,
      user: {
        id: this.selectedMember.userId
      }
    };
    this.memberService.updateMember(this.selectedMember.id, member).subscribe(
      () => this.getMembers()
    );
  }
}
