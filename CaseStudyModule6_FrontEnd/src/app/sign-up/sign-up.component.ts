import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RegisterService} from "../service/register/register.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
    nickname: new FormControl()
  })

  constructor(private registerService: RegisterService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  login() {
    this.router.navigateByUrl('/login')
  }

  register() {
    // console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.registerService.createUser(this.registerForm.value).subscribe(() => {
        alert("Create success!")
        this.registerForm = new FormGroup({
          username: new FormControl('', [Validators.required, Validators.minLength(6)]),
          password: new FormControl('', [Validators.required]),
          nickname: new FormControl()
        });
      });
    } else {
      alert("Fail!")
    }
  }

  get username() {
    return this.registerForm.get('username');
  }
}
