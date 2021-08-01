import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-trello-view',
  templateUrl: './trello-view.component.html',
  styleUrls: ['./trello-view.component.scss']
})
export class TrelloViewComponent implements OnInit {
  currentUser: UserToken = {};

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
    this.currentUser = this.authenticationService.getCurrentUserValue();
  }

  ngOnInit(): void {
  }

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }
}
