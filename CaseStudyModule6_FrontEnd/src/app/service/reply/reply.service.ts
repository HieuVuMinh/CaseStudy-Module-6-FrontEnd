import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Reply} from "../../model/reply";
import {Observable} from "rxjs";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class ReplyService {

  constructor(private httpClient: HttpClient) { }

  saveReply(reply: Reply): Observable<Reply> {
    return this.httpClient.post<Reply>(`${API_URL}replies`, reply);
  }

  getAllReplyByCommentId(commentId: number): Observable<Reply[]> {
    return this.httpClient.get<Reply[]> (`${API_URL}replies/${commentId}/replies-comment`)
  }

  deleteReplyById(id: number): Observable<Reply> {
    return this.httpClient.delete<Reply>(`${API_URL}replies/${id}`)
  }
}
