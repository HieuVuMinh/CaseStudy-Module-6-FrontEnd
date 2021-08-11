import {Component, Input, OnInit, Output} from '@angular/core';
import {Board} from "../../model/board";
import {DetailedMember} from "../../model/detailed-member";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {User} from "../../model/user";
import {UserService} from "../../service/user/user.service";
import {Member} from "../../model/member";
import {MemberService} from "../../service/member/member.service";
import {BoardService} from "../../service/board/board.service";
import {Router} from "@angular/router";
import {EventEmitter} from '@angular/core';
import {Notification} from "../../model/notification";
import {NotificationService} from "../../service/notification/notification.service";
import {Tag} from "../../model/tag";
import {ActivityLogService} from "../../service/ActivityLog/activity-log.service";
import {ActivityLog} from "../../model/activity-log";
import {UserToken} from "../../model/user-token";
import {RedirectService} from "../../service/redirect/redirect.service";

@Component({
  selector: 'app-navbar-board-header',
  templateUrl: './navbar-board-header.component.html',
  styleUrls: ['./navbar-board-header.component.scss']
})
export class NavbarBoardHeaderComponent implements OnInit {
  @Input() board: Board = {columns: [], owner: {}, title: "", tags: []};
  @Input() tags: Tag[] = [];
  @Input() members: DetailedMember[] = [];
  @Input() canEdit: boolean = false;
  @Input() isInWorkspace: boolean = false;
  searchBarIsShown: boolean = false;
  userSearch: string = ``;
  userResult: User[] = [];
  selectedMember: DetailedMember = {boardId: -1, canEdit: false, id: -1, userId: -1, username: ""};
  @Output() updateMemberEvent = new EventEmitter<DetailedMember[]>();
  currentUser: UserToken = this.authenticationService.getCurrentUserValue()
  receiver: User[] = [];
  tagFilter: number[] = [];
  memberFilter: number[] = [];
  @Output() filterEvent = new EventEmitter<number[][]>();

  constructor(public authenticationService: AuthenticationService,
              private userService: UserService,
              private memberService: MemberService,
              private boardService: BoardService,
              private router: Router,
              public notificationService: NotificationService,
              public activityLogService: ActivityLogService,
              public redirectService: RedirectService) {
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
    this.createNoticeInBoard(`add ${member.user.username}`)
  }

  private resetSearch() {
    this.searchBarIsShown = false;
    this.userSearch = ``;
    this.userResult = [];
  }

  private getMembers() {
    this.memberService.getMembersByBoardId(this.board.id).subscribe(members => {
      this.members = members;
      this.updateMemberEvent.emit(this.members);
    });
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
      // @ts-ignore
      this.createNoticeInBoard(`delete ${this.selectedMember.user.username}`)
      this.getMembers();
      this.closeModal();
    });
  }

  makeSelectedMemberEditor() {
    this.selectedMember.canEdit = true;
    this.updateSelectedMember();
    this.createNoticeInBoard("allow " + this.selectedMember.username + "edit board")
  }

  makeSelectedMemberObserver() {
    this.selectedMember.canEdit = false;
    this.updateSelectedMember();
    this.createNoticeInBoard("remove edit permissions of " + this.selectedMember.username)
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

  updateBoardTitle() {
    if (this.board.id != null) {
      this.boardService.updateBoard(this.board.id, this.board).subscribe(board => this.board = board);
      this.createNoticeInBoard("Update title ")
    }

  }

  showUserPreview(member: DetailedMember) {
    let elementId = 'user-preview-text-' + member.userId;
    let element = document.getElementById(elementId);
    // @ts-ignore
    element.innerHTML = '@' + member.username;
    // @ts-ignore
    element.classList.remove('is-hidden');
  }

  closeUserPreviews() {
    let elements = document.getElementsByClassName('user-preview-text');
    // @ts-ignore
    for (let element of elements) {
      element.classList.add('is-hidden');
    }
  }

  showAllMembers() {
    let members = document.getElementsByClassName('user-preview');
    // @ts-ignore
    for (let member of members) {
      member.classList.remove('is-hidden');
    }
  }

  toggleMenu() {
    let dropdownEle = document.getElementById('menu-btn-dropdown');
    // @ts-ignore
    if (dropdownEle.classList.contains('is-hidden')) {
      // @ts-ignore
      dropdownEle.classList.remove('is-hidden');
    } else {
      // @ts-ignore
      dropdownEle.classList.add('is-hidden');
    }
  }

  toggleDeleteBoardModal() {
    let modalEle = document.getElementById('delete-board-modal');
    // @ts-ignore
    if (modalEle.classList.contains('is-active')) {
      // @ts-ignore
      modalEle.classList.remove('is-active');
    } else {
      // @ts-ignore
      modalEle.classList.add('is-active');
    }
  }

  removeThisBoard() {
    if (this.board.id != null) {
      this.boardService.deleteById(this.board.id).subscribe(() => this.router.navigateByUrl('/trello'));
    }
    this.createNoticeInBoard("Delete")
  }
  createNoticeInBoard(activityText: string) {
    let activity: ActivityLog = {
      title: "Board: " + this.board.title,
      content: this.currentUser.username + " " + activityText + " in " + this.board.title + " " + this.notificationService.getTime(),
      url: "/trello/boards/" + this.board.id,
      status: false,
      board: this.board
    }
    if (this.board.id != null) {
      this.activityLogService.saveNotification(activity, this.board.id)
    }

  }

  toggleElement(elementId: string) {
    let element = document.getElementById(elementId);
    // @ts-ignore
    if (element.classList.contains('is-hidden')) {
      // @ts-ignore
      element.classList.remove('is-hidden');
    } else {
      // @ts-ignore
      element.classList.add('is-hidden');
    }
  }

  filterBoard() {
    this.updateFilterDto();
    this.filterEvent.emit([this.tagFilter, this.memberFilter]);
  }

  private updateFilterDto() {
    this.tagFilter = [];
    this.memberFilter = [];

    let tagOptionElements = document.getElementsByClassName('tag-filter-option');
    // @ts-ignore
    for (let tagOptionElement of tagOptionElements) {
      if (tagOptionElement.checked) {
        this.tagFilter.push(tagOptionElement.value);
      }
    }
    let memberOptionElements = document.getElementsByClassName('member-filter-option');
    // @ts-ignore
    for (let memberOptionElement of memberOptionElements) {
      if (memberOptionElement.checked) {
        this.memberFilter.push(memberOptionElement.value);
      }
    }
  }

  clearFilterBoard() {
    this.filterEvent.emit([[], []]);
    this.clearCheckedOptions();
  }

  private clearCheckedOptions() {
    let optionElements = document.getElementsByClassName('filter-option');
    // @ts-ignore
    for (let optionElement of optionElements) {
      if (optionElement.checked) {
        optionElement.checked = false;
      }
    }
  }

}
