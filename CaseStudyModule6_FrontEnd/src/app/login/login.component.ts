import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "../service/authentication/authentication.service";
import {Router} from "@angular/router";
import {NotificationService} from "../service/notification/notification.service";
import {User} from "../model/user";
import {NavbarService} from "../service/navbar/navbar.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private navbarService: NavbarService,
              private notificationService:NotificationService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.authenticationService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe(() => {
      this.navbarService.getUser();
      this.router.navigateByUrl('/trello');
    });
  }

  register() {
    this.router.navigateByUrl('/register');
  }
}
