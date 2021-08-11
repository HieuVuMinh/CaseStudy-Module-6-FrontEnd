import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/user/user.service";
import {User} from "../model/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  user: User = {};
  divNewPassword = false;
  isConfirmPassword = false;
  confirmPassword = '';

  conFirmForm: FormGroup = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
  });

  newConFirmForm: FormGroup = this.formBuilder.group({});

  finalConfirmForm: FormGroup = new FormGroup({});

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  confirm() {
    this.userService.getUserByUserNameAndEmail(this.conFirmForm.get('username')?.value, this.conFirmForm.get('email')?.value).subscribe(user => {
      this.user = user;
      if (this.user != null) {
        this.divNewPassword = true;
        this.newConFirmForm = this.formBuilder.group({
          username: new FormControl(this.user.username),
          email: new FormControl(this.user.email),
          newPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,100}$')]),
          confirmPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,10}$')]),
          nickname: new FormControl(this.user.nickname)
        });
      } else {
        alert("Incorrect!")
      }
    })
  }

  changeNewPassword(id: any) {
    if (this.newConFirmForm.value.newPassword != this.newConFirmForm.value.confirmPassword) {
      this.isConfirmPassword = true;
    } else {
      this.finalConfirmForm = new FormGroup({
        id: new FormControl(this.user.id),
        username: new FormControl(this.user.username),
        email: new FormControl(this.user.email),
        password: new FormControl(this.newConFirmForm.value.newPassword),
        nickname: new FormControl(this.user.nickname)
      })
      this.userService.updateById(id, this.finalConfirmForm.value).subscribe(()=> {
        alert("Change success!")
        this.router.navigateByUrl('/login')
      })
    }
  }

  get newPassword() {
    return this.newConFirmForm.get('newPassword');
  }
  get newConfirmPassword() {
    return this.newConFirmForm.get('confirmPassword');
  }
}
