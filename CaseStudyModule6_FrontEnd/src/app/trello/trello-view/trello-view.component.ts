import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {BoardService} from "../../service/board.service";
import {CardService} from "../../service/card.service";
import {ColumnService} from "../../service/column.service";
import {Card} from "../../model/card";
import {Column} from "../../model/column";


@Component({
  selector: 'app-trello-view',
  templateUrl: './trello-view.component.html',
  styleUrls: ['./trello-view.component.scss']
})
export class TrelloViewComponent implements OnInit {
  columns: Column[] = [];

  constructor(private boardService: BoardService,
              private cardService: CardService,
              private columnService: ColumnService) {
  }

  ngOnInit(): void {
    this.boardService.findById(1).subscribe(board => {
      this.columnService.findAllByBoard(board.id).subscribe(columns => {
        this.columns = columns;
      })
    })
  }


  dropCard(event: CdkDragDrop<Card[]>, column: Column) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    for (let card of event.item.data.card) {
      console.log(event.item.data.card)
      card.position = event.item.data.card.indexOf(card);
      this.cardService.update(card.id, card).subscribe(() => console.log("ok"))
    }
    for (let card of column.card) {
      console.log(column)
      card.position = column.card.indexOf(card);
      this.cardService.update(card.id, card).subscribe(() => console.log("ok"))
    }

    this.columnService.update(event.item.data.id, event.item.data).subscribe(() => {
      this.columnService.update(column.id, column).subscribe(result => console.log(result))
    });

  }

  dropColumn(event: CdkDragDrop<Column[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
}
