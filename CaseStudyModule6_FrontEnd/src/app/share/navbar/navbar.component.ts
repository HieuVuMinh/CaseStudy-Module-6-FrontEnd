import {Component, OnInit} from '@angular/core';
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/user";
import {NotificationService} from "../../service/notification/notification.service";
import {Notification} from "../../model/notification";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserToken = {};
  user: User = {};
  notifications: Notification[] = [];

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private notificationService: NotificationService) {
    this.authenticationService.currentUserSubject.subscribe(user => {
      this.currentUser = user
    });
  }

  ngOnInit(): void {
    if (this.currentUser) {
      // @ts-ignore
      this.getUserById(this.currentUser.id)
      this.findAllNotificationByUserId()
    }
  }

  getUserById(id: number) {
    this.userService.getUserById(id).subscribe(user => {
      this.user = user;
    })
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login')
  }
  findAllNotificationByUserId(){
    if (this.currentUser?.id != null) {
      this.notificationService.findAllByUser(this.currentUser.id).subscribe(notifications => {
        this.notifications = notifications
      })
    }
  }
}
