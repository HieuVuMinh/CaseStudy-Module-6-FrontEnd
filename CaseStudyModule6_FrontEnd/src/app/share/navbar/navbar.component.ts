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
import {BoardService} from "../../service/board/board.service";
import {ToastService} from "../../service/toast/toast.service";
import {SearchResult} from "../../model/search-result";
import {RedirectService} from "../../service/redirect/redirect.service";
import {NavbarService} from "../../service/navbar/navbar.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserToken = {};
  user: User = {};
  imgSrc: any;
  selectedImage: any | undefined = null;
  isSubmitted = false;
  id: any = {};
  searchResults: SearchResult[] = [];
  searchString: string = '';


  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              public notificationService: NotificationService,
              private storage: AngularFireStorage,
              private boardService: BoardService,
              private redirectService: RedirectService,
              private toastService: ToastService,
              public navbarService: NavbarService) {
    this.authenticationService.currentUserSubject.subscribe(user => {
      this.currentUser = user
    });
  }

  ngOnInit(): void {
    this.navbarService.getUser();
    if (this.currentUser) {
      this.findAllNotificationByUserId();
    }
    this.getUserById();
  }

  getUserById() {
    if (this.authenticationService.getCurrentUserValue() != null) {
      this.id = this.authenticationService.getCurrentUserValue().id;
      this.userService.getUserById(this.id).subscribe(user => {
        this.user = user;
        if (this.user.image == null) {
          this.user.image = "https://i.pinimg.com/originals/57/fb/31/57fb3190d0cc1726d782c4e25e8561e9.png";
        }
        this.imgSrc = this.navbarService.user.image;
      })
    }
  }

  updateUserInfo() {
    this.isSubmitted = true;
    if (this.selectedImage != null) {
      // @ts-ignore
      const filePath = `${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.imgSrc = url;
            this.user.image = url;
            this.userService.updateById(this.id, this.user).subscribe(() => {
                this.toastService.showMessageSuccess("Update success", 'is-success');
                this.navbarService.getUser();
                this.closeModalUpdate();
              },
              () => {
                this.toastService.showMessageSuccess("Fail !", 'is-danger');
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
        this.notificationService.notification = notifications
        for (let notification of notifications) {
          if (!notification.status) {
            this.notificationService.unreadNotice++;
          }
        }
      })
    }
  }

  openModalUpdate() {
    // @ts-ignore
    document.getElementById("modal-update-user").classList.add('is-active')
    this.getUserById()
  }

  closeModalUpdate() {
    // @ts-ignore
    document.getElementById('modal-update-user').classList.remove('is-active')
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModalUpdate();
  }

  markReadNotification(notification: Notification) {
    if (notification.id != null && !notification.status) {
      notification.status = true;
      this.notificationService.updateNotification(notification.id, notification).subscribe(() => this.notificationService.unreadNotice--)
    }
  }

  markAllAsRead() {
    if (this.currentUser.id != null) {
      this.notificationService.markAllAsRead(this.currentUser.id).subscribe(() => {
        this.notificationService.unreadNotice = 0
        // @ts-ignore
        this.notificationService.findAllByUser(this.currentUser.id).subscribe(notifications => this.notificationService.notification = notifications)
      })
    }
  }

  search() {
    // @ts-ignore
    if (this.searchString == '') {
      this.searchResults = [];
    } else {
      if (this.currentUser != null) {
        this.boardService.findAllAvailableToSearcher(this.currentUser.id).subscribe(boards => {
          let searchResults = [];
          for (let board of boards) {
            for (let column of board.columns) {
              for (let card of column.cards) {
                let keywordInCardTitle = card.title.toLowerCase().includes(this.searchString.toLowerCase());
                let keywordInCardContent = card.content.toLowerCase().includes(this.searchString.toLowerCase());
                if (keywordInCardTitle || keywordInCardContent) {
                  let searchResult: SearchResult = {
                    board: board,
                    column: column,
                    card: card,
                    preview: []
                  }
                  if (keywordInCardTitle) {
                    searchResult.preview = this.createPreview(card.title, this.searchString);
                  } else if (keywordInCardContent) {
                    searchResult.preview = this.createPreview(card.content, this.searchString);
                  }
                  searchResults.push(searchResult);
                  if (searchResults.length == 5) break;
                }
              }
            }
          }
          this.searchResults = searchResults;
        });
      }
    }
  }

  clearSearch(searchResult: SearchResult) {
    this.searchString = '';
    this.searchResults = [];
    this.redirectService.showModal(searchResult.card);
  }

  private createPreview(content: string, searchString: string): string[] {
    let index = content.toLowerCase().indexOf(searchString.toLowerCase());
    let beforeKeyword: string = content.substring(0, index);
    let keyword: string = content.substring(index, index + searchString.length);
    let afterKeyword: string = content.substring(index + searchString.length, content.length);
    return [beforeKeyword, keyword, afterKeyword]
  }
}
