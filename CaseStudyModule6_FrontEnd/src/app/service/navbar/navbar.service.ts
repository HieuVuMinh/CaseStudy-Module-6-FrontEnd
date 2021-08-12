import {Injectable} from '@angular/core';
import {User} from "../../model/user";
import {AuthenticationService} from "../authentication/authentication.service";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  user: User = {}

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  getUser() {
    if (this.authenticationService.getCurrentUserValue() != null) {
      let userId = this.authenticationService.getCurrentUserValue().id;
      if (userId != null) {
        this.userService.getUserById(userId).subscribe(user => {
          this.user = user;
        });
      }
    }
  }

}
