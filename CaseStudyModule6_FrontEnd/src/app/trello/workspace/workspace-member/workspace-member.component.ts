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

@Component({
  selector: 'app-workspace-member',
  templateUrl: './workspace-member.component.html',
  styleUrls: ['./workspace-member.component.scss']
})
export class WorkspaceMemberComponent implements OnInit {
  workspace: Workspace ={boards: [], id: 0, members: [], owner: undefined, title: "", type: ""}
  owner: User={}
  userList: Boolean = true;
  users: User[] = [];
  addUserList: User[] = [];
  user: User = {};
  currentUser: UserToken = this.authenticationService.getCurrentUserValue();
  memberWorkspace: MemberWorkspace = {}
  roleUserInWorkspace: boolean = false;
  modalDelete = false;
  membersDto: Member[] = [];
  constructor(private workspaceService: WorkspaceService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private memberWorkspaceService: MemberWorkspaceService,
              private router: Router,
              private memberService: MemberService,) {

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

  public updateWorkspace() {
    if (this.addUserList.length > 0) {
      for (let user of this.addUserList) {
        this.memberWorkspace = {
          user: user,
          role: "Member"
        }
        this.memberWorkspaceService.create(this.memberWorkspace).subscribe((memberWorkspace) => {
          this.workspace.members.push(memberWorkspace);
          this.workspaceService.update(this.workspace.id, this.workspace).subscribe(() => this.addUserList = [])
        })
      }
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
      }
    }
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
    this.workspace.members.splice(i, 1)
    this.workspaceService.update(this.workspace.id,this.workspace).subscribe()
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
    if (this.currentUser.id == this.workspace.owner?.id) {
      this.roleUserInWorkspace = true
    }
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
      this.router.navigateByUrl(`/trello/workspaces`)
    })
  }

  updateMember(member: MemberWorkspace, role: string){
    member.role = role;
    this.memberWorkspaceService.update(member.id, member).subscribe()
  }
}
