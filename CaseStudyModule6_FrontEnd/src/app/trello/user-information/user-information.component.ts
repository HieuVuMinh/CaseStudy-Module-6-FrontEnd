import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/user";
import {ActivatedRoute} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/storage";
import {finalize} from "rxjs/operators";
import {AuthenticationService} from "../../service/authentication/authentication.service";

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {

  user: User = {};
  imgSrc: string | undefined;
  selectedImage: any | undefined = null;
  isSubmitted = false;

  constructor(private userService: UserService,
              private storage: AngularFireStorage,
              private authenticationService: AuthenticationService) {
    const id = this.getCurrentUserId()
  }

  ngOnInit(): void {
    this.imgSrc = this.user.image;
  }

  getUserById(id: any) {
    this.userService.getUserById(id).subscribe(user => {
      this.user = user;
    })
  }

  getCurrentUserId() {
    console.log(this.authenticationService.getCurrentUserValue().id)
    return this.authenticationService.getCurrentUserValue().id;
  }

  updateUserInfo(id: any) {
    this.isSubmitted = true;
    if (this.selectedImage != null) {
      const filePath = `${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log(url);
            this.imgSrc = url;
            console.log(this.imgSrc)
            this.user.image = url;
            this.userService.updateById(id, this.user);
          });
        }));
    }
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = event.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      if (this.selectedImage != null) {
        const filePath = `${this.selectedImage.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.imgSrc = url;
            });
          })).subscribe();
      }
    } else {
      this.selectedImage = null;
    }
  }
}
