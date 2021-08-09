import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Card} from "../../model/card";
import {Observable} from "rxjs";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private httpClient: HttpClient) {
  }

  update(id: number, card: Card): Observable<Card> {
    return this.httpClient.put<Card>(`${API_URL}cards/${id}`, card);
  }

  updateAll(cards: Card[]): Observable<Card[]> {
    return this.httpClient.put<Card[]>(`${API_URL}cards`, cards);
  }

  getAllCard(): Observable<Card[]> {
    return this.httpClient.get<Card[]>(`${API_URL}cards`);
  }

  saveCard(card : Card): Observable<Card>{
    return this.httpClient.post<Card>(`${API_URL}cards`, card);
  }

  deleteById(id: any): Observable<Card>{
    return this.httpClient.delete<Card>(`${API_URL}cards/${id}`);
  }
}
