import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommentCard} from "../../model/commentCard";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class CommentCardService {

  constructor(private httpClient: HttpClient) { }

  save(commentCard: CommentCard): Observable<CommentCard> {
    return this.httpClient.post<CommentCard>(`${API_URL}comments`, commentCard);
  }

  findAllByCardId(cardId: any): Observable<CommentCard> {
    return this.httpClient.get<CommentCard>(`${API_URL}comments/${cardId}/comment-card`);
  }

  deleteComment(id: any): Observable<CommentCard> {
    return this.httpClient.delete(`${API_URL}comments/${id}`)
  }
}
