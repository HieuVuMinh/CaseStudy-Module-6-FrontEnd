import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Tag} from "../../model/tag";
import {Observable} from "rxjs";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private httpClient: HttpClient) {
  }

  add(tag: Tag): Observable<Tag> {
    return this.httpClient.post<Tag>(`${API_URL}tags`, tag);
  }

  deleteById(id: number): Observable<Tag> {
    return this.httpClient.delete<Tag>(`${API_URL}tags/${id}`);
  }
}
