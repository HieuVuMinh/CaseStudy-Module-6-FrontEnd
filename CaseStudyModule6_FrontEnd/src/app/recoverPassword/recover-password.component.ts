import {Component, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup, Validators} from "@angular/forms";
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

  newConFirmForm: FormGroup = new FormGroup({});


  constructor(private userService: UserService,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  confirm() {
    if (this.confirmPassword != this.conFirmForm.value.password){
      this.isConfirmPassword = true;
    }
    this.userService.getUserByUserNameAndEmail(this.conFirmForm.get('username')?.value, this.conFirmForm.get('email')?.value).subscribe(user => {
      this.user = user;
      if (this.user != null){
        this.divNewPassword = true;
        this.newConFirmForm = new FormGroup({
          username: new FormControl(this.user.username),
          email: new FormControl(this.user.email),
          password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]),
          nickname: new FormControl(this.user.nickname)
        });
      }else {

      }
    })
  }

  changeNewPassword(id: any) {
    console.log(this.newConFirmForm.value, id);
    this.userService.updateById(id, this.newConFirmForm.value).subscribe(()=> {
      this.router.navigateByUrl('/login')
    })
  }

  get password() {
    return this.newConFirmForm.get('password');
  }
}
