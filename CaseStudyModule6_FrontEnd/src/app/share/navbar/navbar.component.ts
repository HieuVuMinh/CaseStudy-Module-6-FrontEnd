import {Component, OnInit} from '@angular/core';
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserToken = {};
  user: User = {};

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService) {
    this.authenticationService.currentUserSubject.subscribe(user => {
      this.currentUser = user
    });
  }

  ngOnInit(): void {
    if (this.currentUser) {
      // @ts-ignore
      this.getUserById(this.currentUser.id)
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
}
