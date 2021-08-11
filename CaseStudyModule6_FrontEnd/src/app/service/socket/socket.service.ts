import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Board} from "../../model/board";
import {BoardService} from "../board/board.service";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  stompClient: any;
  boards: Board[] = [];

  constructor(private boardService: BoardService) {
    this.getAllBoards();
  }

  getAllBoards() {
    this.boardService.getAllBoards().subscribe(boards => this.boards = boards);
  }

  connect() {
    const ws = new SockJS(`${API_URL}ws`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      // @ts-ignore
      this.stompClient.subscribe('/topic/boards', data => {
        const jsonData = JSON.parse(data.body);
        this.boards.push(jsonData);
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  createBoardUsingSocket(board: any) {
    this.stompClient.send('/app/boards', {}, JSON.stringify(board));
  }
}
