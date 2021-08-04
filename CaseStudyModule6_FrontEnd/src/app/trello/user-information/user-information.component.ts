import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/user";
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
  imgSrc: any | undefined = 'https://newsmd1fr.keeng.net/tiin/archive/images/20210220/145211_facebook_doi_anh_dai_dien_2.jpgs ';
  selectedImage: any | undefined = null;
  isSubmitted = false;
  id: any = {};

  constructor(private userService: UserService,
              private storage: AngularFireStorage,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.id = this.authenticationService.getCurrentUserValue().id;
    this.getUserById();
  }

  getUserById() {
    this.id = this.authenticationService.getCurrentUserValue().id;
    this.userService.getUserById(this.id).subscribe(user => {
      this.user = user;
      this.imgSrc = this.user.image;
      console.log("This imgSrc onInit: " + this.imgSrc)
    })
  }

  updateUserInfo() {
    this.isSubmitted = true;
    if (this.selectedImage != null) {
      const filePath = `${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log("Url: " + url);
            this.imgSrc = url;
            console.log("This img after upload: " + this.imgSrc)
            this.user.image = url;
            this.userService.updateById(this.id, this.user).subscribe(() => {
                alert("Success")
              },
              () => {
                alert("Fail")
              });
          });
        })).subscribe();
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
