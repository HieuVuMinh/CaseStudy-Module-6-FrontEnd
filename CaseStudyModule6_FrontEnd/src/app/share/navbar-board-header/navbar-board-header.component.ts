import {Component, Input, OnInit} from '@angular/core';
import {Board} from "../../model/board";
import {DetailedMember} from "../../model/detailed-member";
import {MemberService} from "../../service/member/member.service";

@Component({
  selector: 'app-navbar-board-header',
  templateUrl: './navbar-board-header.component.html',
  styleUrls: ['./navbar-board-header.component.scss']
})
export class NavbarBoardHeaderComponent implements OnInit {
  @Input() board: Board = {columns: [], owner: {}, title: ""}
  @Input() members: DetailedMember[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }


}
