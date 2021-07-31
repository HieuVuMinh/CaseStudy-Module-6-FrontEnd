import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {AuthenticationService} from "../service/authentication/authentication.service";
import {Router} from "@angular/router";

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
              private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    console.log(this.loginForm);
    this.authenticationService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe(() => {
      console.log("Thành công")
      this.router.navigateByUrl('');
    });
  }
}
