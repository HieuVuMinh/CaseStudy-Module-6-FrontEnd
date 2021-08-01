import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Board} from "../model/board";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }

  findById(id: number): Observable<Board>{
    return this.http.get<Board>(`${environment.apiUrl}/boards/${id}`);
  }
}
