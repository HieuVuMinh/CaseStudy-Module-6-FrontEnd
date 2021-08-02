import {Component, OnInit} from '@angular/core';
import {Form, FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../service/user/user.service";
import {User} from "../model/user";
import {ActivatedRoute} from "@angular/router";

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
              private activatedRoute: ActivatedRoute) {
    // activatedRoute.paramMap.subscribe(paramMap => {
    //   const id = paramMap.get('id');
    //   this.changeNewPassword(id);
    // });
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
    })
  }
}
