import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Column} from "../../model/column";
import {Observable} from "rxjs";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class ColumnService {

  constructor(private httpClient: HttpClient) {
  }

  update(id: any, column: Column): Observable<Column> {
    return this.httpClient.put<Column>(`${API_URL}columns/${id}`, column);
  }

  updateAll(columns: Column[]): Observable<Column[]> {
    return this.httpClient.put<Column[]>(`${API_URL}columns`, columns);
  }

  deleteAllById(ids: number[]): Observable<Column[]> {
    return this.httpClient.post<Column[]>(`${API_URL}columns/delete`, ids);
  }

  save(column: Column): Observable<Column> {
    return this.httpClient.post<Column>(`${API_URL}columns`, column);
  }

  getAllColumn(): Observable<Column[]> {
    return this.httpClient.get<Column[]>(`${API_URL}columns`);
  }
}
