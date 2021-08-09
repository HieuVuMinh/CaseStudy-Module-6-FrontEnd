import {Component, HostListener, OnInit} from '@angular/core';
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/user";
import {AngularFireStorage} from "@angular/fire/storage";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserToken = {};
  user: User = {};
  imgSrc: any | undefined = 'https://newsmd1fr.keeng.net/tiin/archive/images/20210220/145211_facebook_doi_anh_dai_dien_2.jpgs ';
  selectedImage: any | undefined = null;
  isSubmitted = false;
  id: any = {};


  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private storage: AngularFireStorage,
              private userService: UserService) {
    this.authenticationService.currentUserSubject.subscribe(user => {
      this.currentUser = user
    });
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
            this.imgSrc = url;
            this.user.image = url;
            console.log("This.user.image: "+this.user.image);
            this.userService.updateById(this.id, this.user).subscribe(() => {
                console.log("This.id : "+this.id);
                console.log("This.user: "+this.user);
                alert("Success");
                this.closeModalUpdate();
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
              console.log("ImgSrc : "+this.imgSrc);
            });
          })).subscribe();
      }
    } else {
      this.selectedImage = null;
    }
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login')
  }

  openModalUpdate() {
    // @ts-ignore
    document.getElementById('modal-update-user').classList.add('is-active')
  }

  closeModalUpdate() {
    // @ts-ignore
    document.getElementById('modal-update-user').classList.remove('is-active')
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModalUpdate();
  }
}
