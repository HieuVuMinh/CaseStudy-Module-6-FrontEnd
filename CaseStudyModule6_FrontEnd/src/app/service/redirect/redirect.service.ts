import { Injectable } from '@angular/core';
import {Card} from "../../model/card";
import {Attachment} from "../../model/attachment";
import {CommentCard} from "../../model/commentCard";
import {AttachmentService} from "../attachment/attachment.service";
import {CommentCardService} from "../comment/comment-card.service";

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  modalClass: string = '';
  card: Card = {content: "", id: 0, position: 0, title: ""};
  attachments: Attachment[] = [];
  comments: CommentCard[] = [];

  constructor(private attachmentService: AttachmentService,
              private commentCardService: CommentCardService) { }

  showModal(card: Card){
    this.card = card;
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

  showCardModal(){
    this.modalClass = 'is-active';
  }

  hideCardModal(){
    this.modalClass = '';
  }
}
