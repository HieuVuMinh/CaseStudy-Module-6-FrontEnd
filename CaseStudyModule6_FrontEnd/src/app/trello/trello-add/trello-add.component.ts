import { Component, OnInit } from '@angular/core';
import {ModalService} from "../../service/modal/modal.service";

@Component({
  selector: 'app-trello-add',
  templateUrl: './trello-add.component.html',
  styleUrls: ['./trello-add.component.scss']
})
export class TrelloAddComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {

  }

  showModal() {
    this.modalService.show();
  }
}
