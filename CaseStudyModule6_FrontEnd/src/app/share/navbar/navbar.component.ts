import {Component, OnInit} from '@angular/core';
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserToken = {};

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
    this.currentUser = this.authenticationService.getCurrentUserValue();
  }

  ngOnInit(): void {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }
}
