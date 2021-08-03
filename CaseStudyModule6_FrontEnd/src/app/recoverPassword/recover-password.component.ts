import {Component, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup} from "@angular/forms";
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

  conFirmForm: FormGroup = new FormGroup({
    username: new FormControl(),
    nickname: new FormControl()
  });

  newConFirmForm: FormGroup = new FormGroup({});


  constructor(private userService: UserService,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  confirm() {
    this.userService.getUserByUserNameAndNickName(this.conFirmForm.get('username')?.value, this.conFirmForm.get('nickname')?.value).subscribe(user => {
      this.user = user;
      if (this.user != null){
        this.divNewPassword = true;
        this.newConFirmForm = new FormGroup({
          username: new FormControl(this.user.username),
          nickname: new FormControl(this.user.nickname),
          password: new FormControl()
        });
      }
    })
  }

  changeNewPassword(id: any) {
    console.log(this.newConFirmForm.value, id);
    this.userService.updateById(id, this.newConFirmForm.value).subscribe(()=> {
      alert("Change Success!")
      this.router.navigateByUrl('/login')
    })
  }
}
