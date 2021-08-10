import {Component, HostListener, OnInit} from '@angular/core';
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user/user.service";
import {User} from "../../model/user";
import {NotificationService} from "../../service/notification/notification.service";
import {Notification} from "../../model/notification";
import {AngularFireStorage} from "@angular/fire/storage";
import {finalize} from "rxjs/operators";
import {Board} from "../../model/board";
import {BoardService} from "../../service/board/board.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserToken = {};
  user: User = {};
  notifications: Notification[] = [];
  imgSrc: any | undefined = 'https://newsmd1fr.keeng.net/tiin/archive/images/20210220/145211_facebook_doi_anh_dai_dien_2.jpgs ';
  selectedImage: any | undefined = null;
  isSubmitted = false;
  id: any = {};
  boardResults: Board[] = [];
  searchString: string = '';

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private notificationService: NotificationService,
              private storage: AngularFireStorage,
              private boardService: BoardService) {
    this.authenticationService.currentUserSubject.subscribe(user => {
      this.currentUser = user
    });
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.findAllNotificationByUserId()
    }

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
            this.userService.updateById(this.id, this.user).subscribe(() => {
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

  findAllNotificationByUserId() {
    if (this.currentUser?.id != null) {
      this.notificationService.findAllByUser(this.currentUser.id).subscribe(notifications => {
        this.notifications = notifications
      })
    }
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

  search() {
    // @ts-ignore
    if (this.searchString == '') {
      this.boardResults = [];
    } else {
      this.boardService.findAllByKeyword(this.searchString).subscribe(boards => this.boardResults = boards);
    }
  }

  clearSearch() {
    this.searchString = '';
    this.boardResults = [];
  }
}
