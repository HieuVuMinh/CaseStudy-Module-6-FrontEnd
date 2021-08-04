import { Component, OnInit } from '@angular/core';
import {Board} from "../../model/board";
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {BoardService} from "../../service/board/board.service";
import {ModalService} from "../../service/modal/modal.service";

@Component({
  selector: 'app-trello-home',
  templateUrl: './trello-home.component.html',
  styleUrls: ['./trello-home.component.scss']
})
export class TrelloHomeComponent implements OnInit {
  currentUser: UserToken = {};
  yourBoards: Board[] = [];
  sharedBoards: Board[] = [];

  constructor(private authenticationService: AuthenticationService,
              private boardService: BoardService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCurrentUserValue();
    console.log(this.currentUser.id)
    this.getYourBoards();
    this.getSharedBoards();
  }


  private getSharedBoards() {
    this.boardService.findAllSharedBoardsByUserId(this.currentUser.id).subscribe(boards => this.sharedBoards = boards);
  }

  private getYourBoards() {
    this.boardService.findAllOwnedBoardsByUserId(this.currentUser.id).subscribe(boards => {
      this.yourBoards = boards;
      console.log(this.yourBoards);
    });
  }

  showAddBoardModal() {
    this.modalService.show();
  }
}
