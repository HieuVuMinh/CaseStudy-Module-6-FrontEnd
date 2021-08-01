import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Column} from "../model/column";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Board} from "../model/board";
import {Card} from "../model/card";

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  constructor(private http: HttpClient) {
  }

  findAllByBoard(board: any): Observable<Column[]> {
    return this.http.get<Column[]>(`${environment.apiUrl}/columns/${board}`);
  }

  update(id: any,column: Column): Observable<Column>{
    return this.http.put<Column>(`${environment.apiUrl}/columns/${id}`, column)
  }
}
