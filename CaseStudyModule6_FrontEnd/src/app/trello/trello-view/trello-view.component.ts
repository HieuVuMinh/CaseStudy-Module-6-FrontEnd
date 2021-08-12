import {Component, HostListener, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ActivatedRoute, Router} from "@angular/router";
import {Board} from "../../model/board";
import {Column} from "../../model/column";
import {Card} from "../../model/card";
import {BoardService} from "../../service/board/board.service";
import {ColumnService} from "../../service/column/column.service";
import {CardService} from "../../service/card/card.service";
import {finalize, map} from "rxjs/operators";
import {DetailedMember} from "../../model/detailed-member";
import {MemberService} from "../../service/member/member.service";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {UserToken} from "../../model/user-token";
import {Attachment} from "../../model/attachment";
import {AngularFireStorage} from "@angular/fire/storage";
import {UserService} from "../../service/user/user.service";
import {CommentCard} from "../../model/commentCard";
import {AttachmentService} from "../../service/attachment/attachment.service";
import {TagService} from "../../service/tag/tag.service";
import {CommentCardService} from "../../service/comment/comment-card.service";
import {Tag} from "../../model/tag";
import {User} from "../../model/user";
import {Notification} from "../../model/notification";
import {NotificationService} from "../../service/notification/notification.service";
import {ActivityLog} from "../../model/activity-log";
import {ActivityLogService} from "../../service/ActivityLog/activity-log.service";
import {Reply} from "../../model/reply";
import {ReplyService} from "../../service/reply/reply.service";
import {ToastService} from "../../service/toast/toast.service";

import {RedirectService} from "../../service/redirect/redirect.service";

@Component({
  selector: 'app-trello-view',
  templateUrl: './trello-view.component.html',
  styleUrls: ['./trello-view.component.scss']
})
export class TrelloViewComponent implements OnInit {
  boardId = -1;
  board: Board = {
    id: -1,
    owner: {},
    title: '',
    columns: []
  };

  commentCard: CommentCard = {}
  reply: Reply = {}

  user: User = {};
  previousColumn: Column = {
    cards: [],
    id: -1,
    position: -1,
    title: ""
  };
  repliesDto: Reply[] = [];
  cardsDto: Card[] = [];
  columnsDto: Column[] = [];
  tags: Tag[] = [];
  members: DetailedMember[] = [];
  columnId = -1;
  commentId = -1;
  replyId = -1;
  columnForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
  })
  commentForm: FormGroup = new FormGroup({
    content: new FormControl(''),
    cardId: new FormControl()
  })
  replyForm: FormGroup = new FormGroup({
    content: new FormControl('')
  })
  currentUser: UserToken = {};
  canEdit: boolean = false;
  isInWorkspace: boolean = false;
  newCard: Card = {
    id: -1,
    title: "",
    content: "",
    position: -1
  }

  newAttachment: Attachment = {
    id: -1,
    source: ""
  }

  isAdded = false;
  newTag: Tag = {
    color: "is-primary",
    name: ""
  }
  deleteTagId: number = -1;

  selectedFile: any | undefined = null;
  isSubmitted = false;

  titleForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
  })

  titleColumn: Column = {cards: [], id: -1, position: -1, title: ""}
  fileSrc: any | undefined = null;
  receiver: User[] = [];


  selectedAttachment: Attachment = {};

  constructor(private activatedRoute: ActivatedRoute,
              private boardService: BoardService,
              private columnService: ColumnService,
              private cardService: CardService,
              private memberService: MemberService,
              public authenticationService: AuthenticationService,
              private router: Router,
              private attachmentService: AttachmentService,
              private storage: AngularFireStorage,
              private tagService: TagService,
              private userService: UserService,
              private replyService: ReplyService,
              private commentCardService: CommentCardService,
              private notificationService: NotificationService,
              private activityLogService: ActivityLogService,
              public redirectService: RedirectService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getBoardIdByUrl();
  }

  findAllActivityByBoardId() {
    if (this.board.id != null) {
      this.activityLogService.findAllByBoardId(this.boardId).subscribe(activities => {
        this.activityLogService.activities = activities;
        for (let notification of activities) {
          if (!notification.status) {
            this.activityLogService.unreadNotice++;
          }
        }
      })
    }
  }

  getBoardIdByUrl() {
    this.currentUser = this.authenticationService.getCurrentUserValue();
    this.activatedRoute.params.pipe(map(p => p.id)).subscribe(id => {
      this.boardId = id;
      this.getPage();
      this.findAllActivityByBoardId()
    });
  }

  getPage() {
    this.getBoard();
  }

  getBoard() {
    this.boardService.getBoardById(this.boardId).subscribe(board => {
      this.board = board;
      // @ts-ignore
      this.tags = this.board.tags;
      this.getMembers();
    })
  }

  private getMembers() {
    this.memberService.getMembersByBoardId(this.boardId).subscribe(members => {
      this.members = members;
      this.updateCanEdit();
    })
  }

  private updateCanEdit() {
    let currentUserId = this.currentUser.id;
    let isOwner = currentUserId == this.board.owner.id;
    let isEditingMember: boolean = false;
    for (let member of this.members) {
      if (currentUserId == member.userId && member.canEdit) {
        isEditingMember = true;
        break;
      }
    }
    if (isOwner || isEditingMember) {
      this.canEdit = true;
    }
    this.updateIsInWorkspace();
  }

  private updateIsInWorkspace() {
    this.boardService.isBoardInWorkspace(this.boardId).subscribe(isInWorkspace => this.isInWorkspace = isInWorkspace);
  }


  public dropColumn(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.board.columns, event.previousIndex, event.currentIndex);
    this.saveChanges();
    if (event.previousIndex != event.currentIndex) {
      this.createNoticeInBoard(`Change position column ${this.board.columns[event.previousIndex].title} with ${this.board.columns[event.currentIndex].title}`)
    }

  }

  public dropCard(event: CdkDragDrop<Card[]>, column: Column): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.setPreviousColumn(event);
    this.saveChanges()
    if (this.previousColumn.id != column.id) {
      this.createNoticeInBoard(`moved ${event.container.data[0].title} from ${this.previousColumn.title} to ${column.title}`)
    }

  }


  private setPreviousColumn(event: CdkDragDrop<Card[]>) {
    let previousColumnId = parseInt(event.previousContainer.id);
    for (let column of this.board.columns) {
      if (column.id == previousColumnId) {
        this.previousColumn = column;
        break;
      }
    }
  }

  public saveChanges() {
    this.updatePositions();
    this.updateDto();
    this.updateCards();
  }

  private updatePositions() {
    let columns = this.board.columns;
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      column.position = i;
      let cards = column.cards;
      for (let j = 0; j < cards.length; j++) {
        cards[j].position = j;
      }
    }
  }

  private updateDto() {
    this.columnsDto = [];
    this.cardsDto = [];
    for (let column of this.board.columns) {
      this.columnsDto.push(column);
      for (let card of column.cards) {
        this.cardsDto.push(card);
      }
    }
  }

  private updateCards() {
    this.cardService.updateAll(this.cardsDto).subscribe(() => this.updatePreviousColumn())
  }

  private updatePreviousColumn() {
    if (this.previousColumn.id != -1) {
      this.columnService.update(this.previousColumn.id, this.previousColumn).subscribe(() => this.updateColumns())
    } else {
      this.updateColumns()
    }
  }

  private updateColumns() {
    this.columnService.updateAll(this.columnsDto).subscribe(() => this.updateBoard());
  }

  private updateBoard() {
    this.boardService.updateBoard(this.boardId, this.board).subscribe(() => {
      if (this.deleteTagId != -1) {
        this.tagService.deleteById(this.deleteTagId).subscribe(() => {
          this.deleteTagId = -1;
          this.getPage()
        })
      } else {
        this.getPage();
      }
    });
  }

  getUserById() {
    // @ts-ignore
    this.userService.getUserById(this.currentUser.id).subscribe(user => this.user = user);
  }

  showUpdateCardModal(card: Card) {
    this.redirectService.showModal(card)
    this.getUserById();
    // this.redirectService.card = card;
    // this.getAllAttachmentByCard();
    // this.redirectService.showCardModal();
    // this.getAllCommentByCardId();
  }

  closeModalUpdateCard() {
    this.redirectService.hideCardModal();
    this.hiddenDeleteAttachmentConfirm();
    this.closeDeleteCommentModal();
    this.hiddenDeleteConfirm();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModalUpdateCard()
  }

// comment
  addComment() {
    let currentUserId = this.authenticationService.getCurrentUserValue().id;
    let member: DetailedMember = {boardId: 0, canEdit: false, id: 0, userId: 0, username: ""}
    for (let m of this.members) {
      if (m.userId == currentUserId) {
        member = m;
      }
    }
    // @ts-ignore
    let memberDto: Member = {board: {id: member.id}, canEdit: member.canEdit, id: member.id, user: {id: member.userId}}
    let commentCard: CommentCard = {
      content: this.commentForm.value.content,
      card: this.redirectService.card,
      member: memberDto
    };
    this.commentForm = new FormGroup({
      content: new FormControl('')
    });
    this.commentCardService.save(commentCard).subscribe(() => {
      this.getAllCommentByCardId();
    })
  }

  getAllCommentByCardId() {
    this.commentCardService.findAllByCardId(this.redirectService.card.id).subscribe(comments => {
      // @ts-ignore
      this.redirectService.comments = comments;
    })
  }

// Modal Column
  showDeleteColumnModal(id: any) {
    // @ts-ignore
    document.getElementById("deleteColumnModal").classList.add("is-active")
    this.columnId = id;
  }

  deleteColumn() {
    for (let column of this.board.columns) {
      if (column.id == this.columnId) {
        // @ts-ignore
        this.columnService.deleteById(column.id).subscribe()

        let deleteId = this.board.columns.indexOf(column);
        this.board.columns.splice(deleteId, 1);
        this.saveChanges();
        this.closeDeleteColumnModal();
        this.toastService.showMessageSuccess("Delete success!", "is-success")
        let notification = "Delete column: " + column.title
        this.createNoticeInBoard(notification)
      }
    }
  }

  closeDeleteColumnModal() {
    // @ts-ignore
    document.getElementById("deleteColumnModal").classList.remove("is-active")
  }

// Modal comment
  showDeleteCommentModal(id: any) {
    // @ts-ignore
    document.getElementById("deleteCommentModal").classList.add("is-active")
    this.commentId = id;
  }


  deleteAllReply(comment: CommentCard) {
    // @ts-ignore
    for (let reply of comment.replies){
      // @ts-ignore
      this.replyService.deleteReplyById(reply.id).subscribe()
    }
  }

  deleteAllComment() {
    for (let comment of this.redirectService.comments){
      this.deleteAllReply(comment)
      this.commentCardService.deleteComment(comment.id).subscribe()
    }
  }

  deleteComment() {
    let newCommentCard: CommentCard = {};
    for (let comment of this.redirectService.comments) {
      if (comment.id == this.commentId){
        newCommentCard = comment;
        break;
      }
    }
    // @ts-ignore
    for (let reply of newCommentCard.replies){
      // @ts-ignore
      this.replyService.deleteReplyById(reply.id).subscribe()
    }
    this.commentCardService.deleteComment(this.commentId).subscribe(() => {
      this.toastService.showMessageSuccess("Comment deleted",'is-success');
      this.getAllCommentByCardId();
        this.closeDeleteCommentModal()
        this.createNoticeInBoard(`deleted comment`)
      }
    )
  }

  closeDeleteCommentModal() {
    // @ts-ignore
    document.getElementById("deleteCommentModal").classList.remove("is-active")
  }

// Reply
  showDeleteReplyModal(id: any) {
    // @ts-ignore
    document.getElementById("deleteReplyModal").classList.add("is-active")
    this.replyId = id;
  }

  deleteReply() {
    let commentCard1: CommentCard = {};
    for (let comment of this.redirectService.comments) {
      if (comment.id == this.commentId) {
        commentCard1 = comment;
        break;
      }
    }
    // @ts-ignore
    for (let reply of commentCard1.replies) {
      if (reply.id == this.replyId) {
        let deleteReplyId = commentCard1.replies?.indexOf(reply);
        // @ts-ignore
        commentCard1.replies?.splice(deleteReplyId, 1);
      }
    }
    for (let comment of this.redirectService.comments) {
      if (comment.id == this.commentId) {
        comment = commentCard1;
        break;
      }
    }
    this.commentCardService.updateAllComment(this.redirectService.comments).subscribe(() => {
      this.replyService.deleteReplyById(this.replyId).subscribe(() => {
        this.toastService.showMessageSuccess("Reply deleted",'is-success');
      })
      this.closeDeleteReplyModal()
    })
  }

  closeDeleteReplyModal() {
    // @ts-ignore
    document.getElementById("deleteReplyModal").classList.remove("is-active")
  }

  addColumn() {
    if (this.columnForm.valid) {
      // @ts-ignore
      let column: Column = {cards: [], position: this.board.columns.length, title: this.columnForm.value.title};
      this.columnForm = new FormGroup({
        title: new FormControl('', Validators.required)
      });
      this.columnService.save(column).subscribe(column => {
        this.previousColumn = column;
        this.board.columns.push(this.previousColumn);
        this.updateBoard()
        this.createNoticeInBoard(`added column "${column.title}"`)
      })
    }
  }

  onKeydown($event: KeyboardEvent, column: Column) {
    if ($event.key === "Enter") {
      if (column.title != '') {
        this.saveChanges();
      } else {
        this.getPage();
      }
    }
  }

  updateCurrentCard() {
    this.saveChanges();
    this.closeModalUpdateCard();
    this.toastService.showMessageSuccess('Every thing updated', 'is-success');
  }

  addNewCard(id: any, length: any, addNewCardForm: NgForm) {
    this.isAdded = true;
    this.newCard.position = length;
    this.cardService.saveCard(this.newCard).subscribe(card => {
      for (let column of this.board.columns) {
        if (column.id == id && addNewCardForm.valid) {
          column.cards.push(card);
          this.saveChanges();
          this.newCard = {
            id: -1,
            title: "",
            content: "",
            position: -1
          }
          break;
        }
      }
      let notification = "Add new card: " + card.title
      this.createNoticeCard(notification, card)
    })
  }

  showInputAddNewCard(id: any) {
    let elementId = 'new-card-form-col-' + id;
    // @ts-ignore
    document.getElementById(elementId).classList.remove('is-hidden');
    let buttonShowFormCreateId = 'show-form-create-new-card-' + id;
    // @ts-ignore
    document.getElementById(buttonShowFormCreateId).classList.add('is-hidden');
  }

  hiddenInputAddNewCard(id: any) {
    let elementId = 'new-card-form-col-' + id;
    // @ts-ignore
    document.getElementById(elementId).classList.add('is-hidden');
    let buttonShowFormCreateId = 'show-form-create-new-card-' + id;
    // @ts-ignore
    document.getElementById(buttonShowFormCreateId).classList.remove('is-hidden');
  }

  addNewTag() {
    this.tagService.add(this.newTag).subscribe(tag => {
      this.newTag = tag;
      // @ts-ignore
      this.board.tags.push(this.newTag);
      this.saveChanges();
      this.createNoticeInBoard(`add new tag ${tag.name}`)
      this.newTag = {
        color: "is-primary",
        name: ""
      }
    });
  }

  addTagToCard(tag: Tag) {
    this.updateSelectedCard();
    let isValid = true;
    // @ts-ignore
    for (let existingTag of this.redirectService.card.tags) {
      if (existingTag.id == tag.id) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      // @ts-ignore
      this.redirectService.card.tags.push(tag);
      this.createNoticeCard(`add tag "${tag.name}" to card "${this.redirectService.card.title}"`, this.redirectService.card)
    }
    this.saveChanges();
  }

  removeTagFromCard(tag: Tag) {
    this.updateSelectedCard()
    let tagName = tag.name;
    // @ts-ignore
    for (let existingTag of this.redirectService.card.tags) {
      if (existingTag.id == tag.id) {
        // @ts-ignore
        let deleteIndex = this.redirectService.card.tags.indexOf(existingTag);
        // @ts-ignore
        this.redirectService.card.tags.splice(deleteIndex, 1);
      }
    }
    this.saveChanges();
    this.createNoticeCard(`remove tag "${tagName}" from card "${this.redirectService.card.title}"`, this.redirectService.card)
  }

  private updateSelectedCard() {
    for (let column of this.board.columns) {
      for (let card of column.cards) {
        if (card.id == this.redirectService.card.id) {
          this.redirectService.card = card;
        }
      }
    }
  }


  showDeleteTagButton(id: any) {
    // @ts-ignore
    document.getElementById('delete-btn-tag-' + id).classList.remove('is-hidden');
  }

  hideDeleteTagButton(id: any) {
    // @ts-ignore
    document.getElementById('delete-btn-tag-' + id).classList.add('is-hidden');
  }

  deleteTag(id: any) {
    this.deleteTagId = id;
    // delete tag from cards
    for (let column of this.board.columns) {
      for (let card of column.cards) {
        // @ts-ignore
        for (let tag of card.tags) {
          if (tag.id == id) {
            // @ts-ignore
            let deleteIndex = card.tags.indexOf(tag);
            // @ts-ignore
            card.tags.splice(deleteIndex, 1);
          }
        }
      }
    }
    // delete tag from board
    // @ts-ignore
    for (let tag of this.board.tags) {
      if (tag.id == id) {
        // @ts-ignore
        let deleteIndex = this.board.tags.indexOf(tag);
        // @ts-ignore
        this.board.tags.splice(deleteIndex, 1);
        // @ts-ignore
        this.createNoticeInBoard(`deleted tag ${this.board.tags[deleteIndex].name}`)
      }
    }
    this.saveChanges();
  }

  toggleTagForm() {
    let tagFormEle = document.getElementById('tag-form');
    // @ts-ignore
    if (tagFormEle.classList.contains('is-hidden')) {
      // @ts-ignore
      tagFormEle.classList.remove('is-hidden');
    } else {
      // @ts-ignore
      tagFormEle.classList.add('is-hidden');
    }
  }

  toggleMemberForm() {
    let memberFormEle = document.getElementById('member-form');
    // @ts-ignore
    if (memberFormEle.classList.contains('is-hidden')) {
      // @ts-ignore
      memberFormEle.classList.remove('is-hidden');
    } else {
      // @ts-ignore
      memberFormEle.classList.add('is-hidden');
    }
  }

  displaySubmitCommentButton() {
    // @ts-ignore
    document.getElementById("submitComment-" + this.redirectService.card.id).classList.remove('is-hidden')
  }

  showSubmitCommentButton() {
    // @ts-ignore
    document.getElementById("submitComment-" + this.redirectService.card.id).classList.add('is-hidden')
  }

  updateMembers(event: DetailedMember[]) {
    this.members = event;
    this.removeNonMembersFromCards();
  }

  private removeNonMembersFromCards() {
    for (let column of this.board.columns) {
      for (let card of column.cards) {
        // @ts-ignore
        for (let user of card.users) {
          if (!this.isBoardMember(user)) {
            // @ts-ignore
            let deleteIndex = card.users.indexOf(user);
            // @ts-ignore
            card.users.splice(deleteIndex, 1);
            // @ts-ignore
            this.createNoticeInBoard(`deleted member "${card.users[deleteIndex].username}" from card "${card.title}"`)
          }
        }
      }
    }
    this.saveChanges();

  }

  private isBoardMember(user: User): boolean {
    let isBoardMember = false;
    for (let member of this.members) {
      if (member.userId == user.id) {
        isBoardMember = true;
        break;
      }
    }
    return isBoardMember;
  }

  addUserToCard(member: DetailedMember) {
    this.updateSelectedCard();
    let isValid = true;
    // @ts-ignore
    for (let existingUser of this.redirectService.card.users) {
      if (existingUser.id == member.userId) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      let user: User = {
        id: member.userId,
        username: member.username,
      }
      // @ts-ignore
      this.redirectService.card.users.push(user);
      this.createNoticeCard(`add user "${user.username}" to card "${this.redirectService.card.title}"`, this.redirectService.card)
    }
    this.saveChanges();

  }

  deleteCard() {
    this.deleteAllComment();
    this.cardService.deleteById(this.redirectService.card.id).subscribe(() => {
      this.hiddenDeleteConfirm();
      this.closeModalUpdateCard();
      this.getPage();
      this.toastService.showMessageSuccess("Delete success", 'is-success');
    });
    this.createNoticeInBoard(`deleted card "${this.redirectService.card.title}"`)
  }

  uploadFile() {
    this.isSubmitted = true;
    let isMember = false;
    for (let member of this.members) {
      if (member.userId == this.currentUser.id) {
        // @ts-ignore
        this.newAttachment.member = member;
        isMember = true;
        this.newAttachment.card = this.redirectService.card;
        break;
      }
    }
    if (isMember && this.selectedFile != null) {
      const filePath = `${this.selectedFile.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedFile).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.fileSrc = url;
            this.newAttachment.source = url;
            this.newAttachment.name = `${this.selectedFile.name}`;
            this.attachmentService.addNewFile(this.newAttachment).subscribe(() => {
                this.toastService.showMessageSuccess("Upload success", 'is-success');
                this.getAllAttachmentByCard();
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
      reader.onload = (e: any) => this.fileSrc = event.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedFile = event.target.files[0];
      if (this.selectedFile != null) {
        const filePath = `${this.selectedFile.name.split('.').splice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedFile).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.fileSrc = url;
            });
          })).subscribe();
      }
    } else {
      this.selectedFile = null;
    }
    this.uploadFile();
  }

  showFormUploadFile() {
    // @ts-ignore
    document.getElementById('form-upload-file').classList.remove('is-hidden');
  }

  hiddenDeleteConfirm() {
    // @ts-ignore
    document.getElementById('delete-card-modal').classList.remove('is-active');
  }

  showDeleteCardModal() {
    // @ts-ignore
    document.getElementById('delete-card-modal').classList.add('is-active');
    // this.closeModalUpdateCard();
  }

  getAllAttachmentByCard() {
    this.attachmentService.getAttachmentByCard(this.redirectService.card.id).subscribe(attachmentList => {
        this.redirectService.attachments = attachmentList;
      }
    )
  }

  showConfirmDeleteAttachment(attachment: Attachment) {
    this.selectedAttachment = attachment;
    // @ts-ignore
    document.getElementById('delete-attachment-confirm').classList.add('is-active');
  }

  hiddenDeleteAttachmentConfirm() {
    // @ts-ignore
    document.getElementById('delete-attachment-confirm').classList.remove('is-active');
  }

  deleteAttachment() {
    this.hiddenDeleteAttachmentConfirm();
    this.attachmentService.deleteAttachmentById(this.selectedAttachment.id).subscribe(() => {
        this.toastService.showMessageSuccess("Delete success", 'is-success');
        this.getAllAttachmentByCard();
      },
      () => {
        this.toastService.showMessageSuccess("Fail !", 'is-danger');
      });
    this.createNoticeCard(`deleted attachment "${this.selectedAttachment.name}" from card "${this.selectedAttachment.card?.title}"`, this.redirectService.card)
  }

  createNoticeInBoard(activityText: string) {
      let activity: ActivityLog = {
        title: "Board: " + this.board.title,
        content: `${this.currentUser.username} ${activityText} at ${this.notificationService.getTime()}`,
        url: "/trello/boards/" + this.board.id,
        status: false,
        board: this.board
      }
      this.activityLogService.saveNotification(activity, this.boardId)

  }
  createNoticeCard(activityText: string, card: Card) {
    let activity: ActivityLog = {
      title: "Board: " + this.board.title,
      content: `${this.currentUser.username} ${activityText} at ${this.notificationService.getTime()}`,
      url: "/trello/boards/" + this.board.id,
      status: false,
      board: this.board,
      card: card
    }
    this.activityLogService.saveNotification(activity, this.boardId)

  }

  removeUserFromCard(user: User) {
    this.updateSelectedCard()
    // @ts-ignore
    for (let existingUser of this.redirectService.card.users) {
      if (existingUser.id == user.id) {
        let username = user.username;
        // @ts-ignore
        let deleteIndex = this.redirectService.card.users.indexOf(existingUser);
        // @ts-ignore
        this.redirectService.card.users.splice(deleteIndex, 1);
        // @ts-ignore
        this.createNoticeInBoard(`deleted user ${username} from card ${this.redirectService.card.title}`, this.redirectService.card)
      }
    }
    this.saveChanges();

  }

  filterBoard(event: number[][]) {
    let tagFilter: number[] = event[0];
    let memberFilter: number[] = event[1];
    let hasFilter = !(tagFilter.length == 0 && memberFilter.length == 0)
    this.boardService.getBoardById(this.boardId).subscribe(board => {
      this.board = board;
      if (hasFilter) {
        for (let column of this.board.columns) {
          for (let i = 0; i < column.cards.length; i++) {
            let card = column.cards[i];
            // @ts-ignore
            if (!this.isValidTag(card, tagFilter)) {
              column.cards.splice(i, 1);
              i--;
            } else if (!this.isValidMember(card, memberFilter)) {
              column.cards.splice(i, 1);
              i--;
            }
          }
        }
      }
    })
  }

  isValidTag(card: Card, tagFilter: number[]) {
    if (tagFilter.length == 0) return true;
    for (let tagId of tagFilter) {
      let isInCard: boolean = false;
      // @ts-ignore
      for (let tag of card.tags) {
        if (tagId == tag.id) {
          isInCard = true;
          break;
        }
      }
      if (!isInCard) return false;
    }
    return true;
  }

  isValidMember(card: Card, memberFilter: number[]) {
    if (memberFilter.length == 0) return true;
    for (let userId of memberFilter) {
      let isInCard: boolean = false;
      // @ts-ignore
      for (let user of card.users) {
        if (userId == user.id) {
          isInCard = true;
          break;
        }
      }
      if (!isInCard) return false;
    }
    return true;
  }

  showReplyForm(id: any) {
    this.commentId = id;
    // @ts-ignore
    let replyForm = document.getElementById("reply-" + id);
    // @ts-ignore
    if (replyForm.classList.contains('is-hidden')) {
      // @ts-ignore
      replyForm.classList.remove("is-hidden");
    } else {
      // @ts-ignore
      replyForm.classList.add("is-hidden");
    }
  }

  addReply(commentId: any, comment: CommentCard) {
    let member: DetailedMember = {boardId: 0, canEdit: false, id: 0, userId: 0, username: ""}
    for (let m of this.members) {
      if (m.userId == this.currentUser.id) {
        member = m;
      }
    }
    // @ts-ignore
    let memberDto: Member = {board: {id: member.id}, canEdit: member.canEdit, id: member.id, user: {id: member.userId}}
    let reply: Reply = {content: this.replyForm.value.content, member: memberDto}
    this.replyForm = new FormGroup({
      content: new FormControl('')
    })
    this.replyService.saveReply(reply).subscribe(reply => {
      this.reply = reply;
      // @ts-ignore
      this.reply.member?.user.username = member.username
      // @ts-ignore
      this.reply.member?.user.nickname = member.nickname
      // @ts-ignore
      this.reply.member?.user.image = member.image

      for (let com of this.redirectService.comments) {
        if (com.id == commentId) {
          com.replies?.push(this.reply);
          break;
        }
      }
      this.commentCardService.updateAllComment(this.redirectService.comments).subscribe(() => {
        if (comment.card) {
          this.createNoticeCard(`reply ${reply.content} to comment ${comment.content}`, comment.card)
        }
      })
    })
  }

}
