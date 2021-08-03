import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../service/modal/modal.service";
import {Board} from "../../model/board";
import {User} from "../../model/user";
import {UserService} from "../../service/user/user.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
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

  constructor(public modalService: ModalService,
              private userService: UserService) {
  }

  ngOnInit(): void {
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
}
