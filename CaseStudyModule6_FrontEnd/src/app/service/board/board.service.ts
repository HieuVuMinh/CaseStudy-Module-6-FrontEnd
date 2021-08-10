import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Board} from "../../model/board";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private httpClient: HttpClient) {
  }

  getAllBoards(): Observable<Board[]> {
    return this.httpClient.get<Board[]>(`${API_URL}boards`);
  }

  getBoardById(id: number): Observable<Board> {
    return this.httpClient.get<Board>(`${API_URL}boards/${id}/sorted`);
  }

  updateBoard(id: number, board: Board): Observable<Board> {
    return this.httpClient.put<Board>(`${API_URL}boards/${id}`, board);
  }

  findAllOwnedBoardsByUserId(id: any): Observable<Board[]> {
    return this.httpClient.get<Board[]>(`${API_URL}users/${id}/owned-boards`);
  }

  findAllSharedBoardsByUserId(id: any): Observable<Board[]> {
    return this.httpClient.get<Board[]>(`${API_URL}users/${id}/shared-boards`);
  }

  addNewBoard(board: Board): Observable<Board> {
    return  this.httpClient.post<Board>(`${API_URL}boards`, board);
  }

  isBoardInWorkspace(id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${API_URL}boards/${id}/is-in-workspace`);
  }

  deleteById(id: number): Observable<Board> {
    return this.httpClient.delete<Board>(`${API_URL}boards/${id}`);
  }
  deleteAllByWorkspace(boards: Board[]): Observable<Board> {
    return this.httpClient.post<Board>(`${API_URL}boards/delete`,boards);
  }
}
