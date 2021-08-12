import {Injectable} from '@angular/core';
import {User} from "../../model/user";
import {AuthenticationService} from "../authentication/authentication.service";
import {UserService} from "../user/user.service";
import {NotificationService} from "../notification/notification.service";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  user: User = {}

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService) {
  }

  getUser() {
    if (this.authenticationService.getCurrentUserValue() != null) {
      let userId = this.authenticationService.getCurrentUserValue().id;
      if (userId != null) {
        this.userService.getUserById(userId).subscribe(user => {
          this.user = user;
        });
        this.notificationService.findAllByUser(userId).subscribe(notifications => {
          this.notificationService.notification = notifications
          for (let notification of notifications) {
            if (!notification.status) {
              this.notificationService.unreadNotice++;
            }
          }
        })
      }
    }
  }

}
