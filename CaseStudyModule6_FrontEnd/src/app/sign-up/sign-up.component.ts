import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RegisterService} from "../service/register/register.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

export function comparePassword(c: AbstractControl) {
  const v = c.value;
  return (v.password === v.confirmPassword) ? null : {
    passwordnotmatch: true
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]),
    nickname: new FormControl('', Validators.required)
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
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.registerService.createUser(this.registerForm.value).subscribe(() => {
        alert("Create success!")
        this.registerForm = new FormGroup({
          username: new FormControl('', [Validators.required, Validators.minLength(6)]),
          password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]),
          nickname: new FormControl('', Validators.required)
        });
      });
    } else {
      alert("Fail!")
    }
  }

  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get nickname() {
    return this.registerForm.get('nickname');
  }
}
