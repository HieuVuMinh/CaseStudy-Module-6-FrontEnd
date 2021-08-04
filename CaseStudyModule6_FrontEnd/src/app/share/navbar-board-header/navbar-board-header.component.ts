import {Component, Input, OnInit} from '@angular/core';
import {Board} from "../../model/board";
import {DetailedMember} from "../../model/detailed-member";
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";

@Component({
  selector: 'app-navbar-board-header',
  templateUrl: './navbar-board-header.component.html',
  styleUrls: ['./navbar-board-header.component.scss']
})
export class NavbarBoardHeaderComponent implements OnInit {
  @Input() board: Board = {columns: [], owner: {}, title: ""}
  @Input() members: DetailedMember[] = [];

  constructor(public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }


}
