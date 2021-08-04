import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-trello-home',
  templateUrl: './trello-home.component.html',
  styleUrls: ['./trello-home.component.scss']
})
export class TrelloHomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  openModal() {
    let modalElement = (<HTMLElement>document.getElementById('modalElement'))
    modalElement.className = "modal is-active";
  }

  closeModal() {
    let modalElement = (<HTMLElement>document.getElementById('modalElement'))
    modalElement.className = "modal";
  }
}
