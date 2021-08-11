import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from "../../../service/workspace.service";
import {UserService} from "../../../service/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Workspace} from "../../../model/workspace";
import {User} from "../../../model/user";
import {UserToken} from "../../../model/user-token";
import {AuthenticationService} from "../../../service/authentication/authentication.service";
import {MemberWorkspace} from "../../../model/member-workspace";
import {MemberWorkspaceService} from "../../../service/memberworkspace/member-workspace.service";
import {MemberService} from "../../../service/member/member.service";
import {Member} from "../../../model/member";
import {NotificationService} from "../../../service/notification/notification.service";
import {Notification} from "../../../model/notification";

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-workspace-member',
  templateUrl: './workspace-member.component.html',
  styleUrls: ['./workspace-member.component.scss']
})
export class WorkspaceMemberComponent implements OnInit {
  workspace: Workspace = {boards: [], id: 0, members: [], owner: undefined, title: "", type: ""}
  owner: User = {}
  userList: Boolean = true;
  users: User[] = [];
  addUserList: User[] = [];
  user: User = {};
  currentUser: UserToken = this.authenticationService.getCurrentUserValue();
  memberWorkspace: MemberWorkspace = {}
  roleUserInWorkspace: boolean = false;
  modalDelete = false;
  membersDto: Member[] = [];
  listMemberWorkspace: MemberWorkspace[] = [];
  notifications: Notification[] = [];
  notification: Notification = {};
  selectPage = "member";

  constructor(private workspaceService: WorkspaceService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private memberWorkspaceService: MemberWorkspaceService,
              private router: Router,
              private memberService: MemberService,
              private notificationService: NotificationService) {

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
      this.owner = workspaces.owner
      this.listMemberWorkspace = this.workspace.members;
      this.checkRole()
    })
  }

  public findAllUserByUsername(keyword: string): void {
    this.userList = true;
    this.user.username = keyword;
    if (keyword != "") {
      this.userService.findUsersByKeyword(keyword).subscribe(users => {

        for (let member of this.workspace.members) {
          for (let user of users) {
            if (member.user?.id == user.id) {
              users.splice(users.indexOf(user), 1)
            }
          }
        }
        for (let member of this.addUserList) {
          for (let user of users) {
            if (member.id == user.id) {
              users.splice(users.indexOf(user), 1)
            }
          }
        }

        this.users = users;

      })
    } else if (keyword == "") {
      this.users = []
    }
  }

  public addMemberWorkspace() {
    if (this.addUserList.length > 0) {
      let memberWorkspace: MemberWorkspace
      for (let user of this.addUserList) {
        this.memberWorkspace = {
          user: user,
          role: "Member"
        }
        this.memberWorkspaceService.create(this.memberWorkspace).subscribe((memberWorkspace) => {
          this.workspace.members.push(memberWorkspace);
          this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => {
          })
        })
      }

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
        showConfirmButton: false,
        timer: 1000
      });
      this.createNotificationAddToWorkspace()
      this.addMemberWorkspaceToBoard()
      this.addUserList = []
    }
  }

  addMemberWorkspaceToBoard() {
    for (let board of this.workspace.boards) {

      for (let member of this.addUserList) {
        let newMember: Member = {
          board: board,
          canEdit: false,
          user: {
            id: member.id
          }
        }
        this.membersDto.push(newMember)
      }
      this.memberService.addNewMembers(this.membersDto).subscribe()
      this.membersDto = [];
    }
  }

  createNotificationAddToWorkspace() {
    let receivers: User[] = [];
    for (let member of this.addUserList) {
      receivers.push(member)
    }
    let notification: Notification = {
      title: this.workspace.title,
      content: this.currentUser.username + " Added you to the workspace at " + this.notificationService.getTime(),
      status: false,
      url: "/trello/workspaces/" + this.workspace.id,
      receiver: receivers
    }

    this.notificationService.saveNotification(notification)
    this.notifications = []
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
    let removeMemberBoard: MemberWorkspace[] = this.workspace.members.splice(i, 1)
    this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => {

      let receivers: User[] = [];
      for (let member of removeMemberBoard) {
        if (member.user) {
          receivers.push(member.user)
        }
      }
      let notification: Notification = {
        title: this.workspace.title,
        content: this.currentUser.username + " Remove you from group  to the workspace at " + this.notificationService.getTime(),
        url: "/trello",
        status: false,
        receiver: receivers
      }

      this.notificationService.createNotification(notification).subscribe()
      receivers = []
    })
    for (let board of this.workspace.boards) {
      for (let member of removeMemberBoard) {
        this.memberService.deleteMemberBoardWorkspace(board.id, member.user?.id).subscribe()
      }
    }
    this.memberWorkspaceService.delete(removeMemberBoard).subscribe()
  }

  public showModal() {
    // @ts-ignore
    document.getElementById("modal-add-member").classList.add("is-active");
  }

  public hideModal() {
    // @ts-ignore
    document.getElementById("modal-add-member").classList.remove("is-active");
  }

  checkRole() {
    for (let member of this.workspace.members) {
      if ((this.currentUser.id == member.user?.id && member.role == "Admin")) {
        this.roleUserInWorkspace = true
      }
    }
  }

  showModalDelete() {
    this.modalDelete = true
  }

  hideModalDelete() {
    this.modalDelete = false
  }

  deleteWorkspace(id: number) {
    this.workspaceService.delete(id).subscribe(() => {
      this.router.navigateByUrl(`/trello`)
      this.createNotification(`deleted workspace ${this.workspace.title}`)
    })
  }

  updateMember(member: MemberWorkspace, role: string) {
    member.role = role;
    this.memberWorkspaceService.update(member.id, member).subscribe()
    let receivers: User[] = [];
    if (member.user) {
      receivers.push(member.user)
    }

    if (role == "Admin") {
      let notification: Notification = {
        title: this.workspace.title,
        content: this.currentUser.username + " has changed your permissions from Member => Admin " + this.notificationService.getTime(),
        url: "/trello/workspace/" + this.workspace.id + "/member",
        status: false,
        receiver: receivers
      }

      this.notificationService.saveNotification(notification)
    } else if (role == 'Member') {
      let notification: Notification = {
        title: this.workspace.title,
        content: this.currentUser.username + " has changed your permissions from Admin => Member " + this.notificationService.getTime(),
        url: "/trello/workspace/" + this.workspace.id + "/member",
        status: false,
        receiver: receivers
      }

      this.notificationService.saveNotification(notification)

    }
  }

  findMemberWorkspaceByKeyword(keyword: String) {
    if (keyword != "") {
      this.memberWorkspaceService.findByKeyword(keyword, this.workspace.id).subscribe(memberWorkspace => {
        this.listMemberWorkspace = memberWorkspace;
      })
    } else {
      this.listMemberWorkspace = this.workspace.members;
    }
  }

  createNotification(notificationText: string) {
    let receivers: User[] = [];
    for (let member of this.workspace.members) {
      if (member.user) {
        receivers.push(member.user)
      }
    }
    let notification: Notification = {
      title: this.workspace.title,
      content: `${this.currentUser.username} ${notificationText} at ${this.notificationService.getTime()}`,
      url: "/trello",
      status: false,
      receiver: receivers
    }

    this.notificationService.saveNotification(notification)
  }
}
