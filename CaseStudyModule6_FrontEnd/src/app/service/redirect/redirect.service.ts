import {Injectable} from '@angular/core';
import {Card} from "../../model/card";
import {Attachment} from "../../model/attachment";
import {CommentCard} from "../../model/commentCard";
import {AttachmentService} from "../attachment/attachment.service";
import {CommentCardService} from "../comment/comment-card.service";
import {User} from "../../model/user";
import {AuthenticationService} from "../authentication/authentication.service";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  modalClass: string = '';
  card: Card = {content: "", id: 0, position: 0, title: ""};
  attachments: Attachment[] = [];
  comments: CommentCard[] = [];
  user: User = {};

  constructor(private attachmentService: AttachmentService,
              private commentCardService: CommentCardService,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  showModal(card: Card) {
    this.card = card;
    this.getUser();
    this.getAttachments();
    this.getComments();
    this.modalClass = 'is-active';
  }

  private getComments() {
    this.commentCardService.findAllByCardId(this.card.id).subscribe(comments => {
      // @ts-ignore
      this.comments = comments;
    })
  }

  private getAttachments() {
    this.attachmentService.getAttachmentByCard(this.card.id).subscribe(attachments => {
        this.attachments = attachments;
      }
    )
  }

  showCardModal() {
    this.modalClass = 'is-active';
  }

  hideCardModal() {
    this.modalClass = '';
  }

  private getUser() {
    let userId = this.authenticationService.getCurrentUserValue().id;
    if (userId != null) {
      this.userService.getUserById(userId).subscribe(user => this.user = user);
    }
  }
}
