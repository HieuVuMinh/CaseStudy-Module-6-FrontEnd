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
import {AttachmentService} from "../../service/attachment/attachment.service";
import {AngularFireStorage} from "@angular/fire/storage";
import {Tag} from "../../model/tag";
import {TagService} from "../../service/tag/tag.service";
import {UserService} from "../../service/user/user.service";
import {CommentCard} from "../../model/commentCard";
import {CommentCardService} from "../../service/comment/comment-card.service";
import {Member} from "../../model/member";

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

  previousColumn: Column = {
    cards: [],
    id: -1,
    position: -1,
    title: ""
  };
  commentDto: CommentCard[] = [];
  cardsDto: Card[] = [];
  columnsDto: Column[] = [];
  members: DetailedMember[] = [];
  commentId = -1;
  selectedCard: Card = {content: "", id: -1, position: -1, title: ""};
  columnForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
  })
  commentForm: FormGroup = new FormGroup({
    content: new FormControl(''),
    cardId: new FormControl()
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

  constructor(private activatedRoute: ActivatedRoute,
              private boardService: BoardService,
              private columnService: ColumnService,
              private cardService: CardService,
              private memberService: MemberService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private attachmentService: AttachmentService,
              private storage: AngularFireStorage,
              private tagService: TagService,
              private userService: UserService,
              private commentCardService: CommentCardService) {
  }

  ngOnInit(): void {
    this.getBoardIdByUrl();
  }

  getBoardIdByUrl() {
    this.currentUser = this.authenticationService.getCurrentUserValue();
    this.activatedRoute.params.pipe(map(p => p.id)).subscribe(id => {
      this.boardId = id;
      this.getPage();
    });
  }

  getPage() {
    this.getBoard();
  }

  getBoard() {
    this.boardService.getBoardById(this.boardId).subscribe(board => {
      this.board = board;
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
  }

  public dropCard(event: CdkDragDrop<Card[]>): void {
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

  showUpdateCardModal(card: Card) {
    this.selectedCard = card;
    // @ts-ignore
    document.getElementById('modal-update-card').classList.add('is-active');
    this.getAllCommentByCardId()
  }

  closeModalUpdateCard() {
    // @ts-ignore
    document.getElementById('modal-update-card').classList.remove('is-active');
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModalUpdateCard()
  }

  addComment() {
    console.log(this.selectedCard)
    let commentCard: CommentCard = {content: this.commentForm.value.content, card: this.selectedCard};
    console.log(commentCard)
    this.commentForm = new FormGroup({
      content: new FormControl(''),
      cardId: new FormControl()
    });
    this.commentCardService.save(commentCard).subscribe(() => {
      this.getAllCommentByCardId();
    })
  }

  getAllCommentByCardId() {
    this.commentCardService.findAllByCardId(this.selectedCard.id).subscribe(comments => {
      // @ts-ignore
      this.commentDto = comments;
    })
  }

  showDeleteCommentModal(id: any) {
    // @ts-ignore
    document.getElementById("deleteModal").classList.add("is-active")
    this.commentId = id;
  }

  deleteComment() {
    this.commentCardService.deleteComment(this.commentId).subscribe(() => {
        alert("Success!")
        this.getAllCommentByCardId();
        this.closeDeleteCommentModal()
      }
    )
  }

  closeDeleteCommentModal() {
    // @ts-ignore
    document.getElementById("deleteModal").classList.remove("is-active")
  }

  // closeColumn(id: any) {
  //   console.log(id);
  //   for (let column of this.board.columns) {
  //     if (column.id == id) {
  //       let deleteId = this.board.columns.indexOf(column);
  //       this.board.columns.splice(deleteId, 1);
  //       this.saveChanges();
  //     }
  //   }
  // }

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

  closeColumn(id: any) {
    for (let column of this.board.columns) {
      if (column.id == id) {
        let deleteId = this.board.columns.indexOf(column);
        this.board.columns.splice(deleteId, 1);
        this.saveChanges();
      }
    }
  }

  addNewTag() {
    this.tagService.add(this.newTag).subscribe(tag => {
      this.newTag = tag;
      this.board.tags?.push(this.newTag);
      // for (let column of this.board.columns) {
      //   for (let card of column.cards) {
      //     if (card.id == this.selectedCard.id) {
      //       card.tags?.push(this.newTag);
      //     }
      //   }
      // }
      this.saveChanges();
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
    for (let existingTag of this.selectedCard.tags) {
      if (existingTag.id == tag.id) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      // @ts-ignore
      this.selectedCard.tags.push(tag);
    }
    this.saveChanges();
  }

  removeTagFromCard(tag: Tag) {
    this.updateSelectedCard()
    // @ts-ignore
    for (let existingTag of this.selectedCard.tags) {
      if (existingTag.id == tag.id) {
        // @ts-ignore
        let deleteIndex = this.selectedCard.tags.indexOf(existingTag);
        // @ts-ignore
        this.selectedCard.tags.splice(deleteIndex, 1);
      }
    }
    this.saveChanges();
  }

  private updateSelectedCard() {
    for (let column of this.board.columns) {
      for (let card of column.cards) {
        if (card.id == this.selectedCard.id) {
          this.selectedCard = card;
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
    document.getElementById("submitComment-" + this.selectedCard.id).classList.remove('is-hidden')
  }

  showSubmitCommentButton() {
    // @ts-ignore
    document.getElementById("submitComment-" + this.selectedCard.id).classList.add('is-hidden')
  }

  updateMembers(event: DetailedMember[]) {
    this.members = event;
  }

  addMemberToCard(member: DetailedMember) {
    this.updateSelectedCard();
    let isValid: boolean = true;
    // @ts-ignore
    for (let existingMember of this.selectedCard.members) {
      if (existingMember.id == member.userId) {
        isValid = false;
        break;
      }
    }
    // if (isValid) {
    //   let memberDto: Member = {
    //     // @ts-ignore
    //     board: {id: member.boardId},
    //     canEdit: member.canEdit,
    //     id: member.id,
    //     user: {id: member.userId, username: member.username}
    //   };
    //   // @ts-ignore
    //   this.selectedCard.members.push(memberDto);
    //   console.log(this.board);
    //   console.log(member);
    //   this.saveChanges();
    // }
  }


  confirmDelete() {
    console.log(this.selectedCard.id);
    // @ts-ignore
    document.getElementById('modal-confirm-delete').classList.remove('is-hidden');
  }

  deleteCard() {
    this.cardService.deleteById(this.selectedCard.id).subscribe(() => {
      this.closeModalUpdateCard();
      this.getPage();
    });
  }

  uploadFile() {
    this.isSubmitted = true;
    let isMember = false;
    for (let member of this.members) {
      if (member.userId == this.currentUser.id) {
        // @ts-ignore
        this.newAttachment.member = member;
        isMember = true;
        this.newAttachment.card = this.selectedCard;
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
            this.attachmentService.addNewFile(this.newAttachment).subscribe(() => {
                alert("Success");
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
  }

  showFormUploadFile() {
    // @ts-ignore
    document.getElementById('form-upload-file').classList.remove('is-hidden');
  }
}
