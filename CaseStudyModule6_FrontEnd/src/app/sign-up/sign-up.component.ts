import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RegisterService} from "../service/register/register.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/user/user.service";
import firebase from "firebase";
import {User} from "../model/user";
import {ToastService} from "../service/toast/toast.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  users: User[] = [];
  userExistence = false;
  emailExistence = false;

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,100}$')]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z][a-z0-9_\\.]{3,32}@[a-z0-9]{2,}(\\.[a-z0-9]{2,4}){1,2}$')]),
    nickname: new FormControl('', Validators.required)
  })

  constructor(private registerService: RegisterService,
              private userService: UserService,
              private router: Router,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.router.navigateByUrl('/login')
  }

  register() {
    // console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.userService.getAllUser().subscribe(users => {
        // @ts-ignore
        this.users = users;
        let nameExisted = false;
        let emailExisted = false
        for (let user of this.users) {
          if (user.username == this.registerForm.value.username) {
            this.userExistence = true;
            nameExisted = true;
            break;
          } else if (user.email == this.registerForm.value.email) {
            this.emailExistence = true;
            emailExisted = true;
            break;
          }
        }
        if (!nameExisted && !emailExisted) {
          this.registerService.createUser(this.registerForm.value).subscribe(() => {
            this.toastService.showMessageSuccess("Create account success", 'is-success');
            this.registerForm = new FormGroup({
              username: new FormControl('', [Validators.required, Validators.minLength(6)]),
              password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,10}$')]),
              email: new FormControl('', [Validators.required, Validators.pattern('^[a-z][a-z0-9_\\.]{3,32}@[a-z0-9]{2,}(\\.[a-z0-9]{2,4}){1,2}$')]),
              nickname: new FormControl('', Validators.required)
            });
            this.router.navigateByUrl('/login')
          });
        }
      })
    } else {
      this.toastService.showMessageSuccess("Inform must be filed!", 'is-warning');
    }
  }

  existence() {
    this.userExistence = false;
    this.emailExistence = false;
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

  get email() {
    return this.registerForm.get('email');
  }
}
