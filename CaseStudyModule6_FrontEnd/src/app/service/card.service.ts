import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Card} from "../model/card";
import {Column} from "../model/column";

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  findAllByColumn(column: Column): Observable<Card[]>{
    return this.http.get<Card[]>(`${environment.apiUrl}/cards`);
  }

  update(id: any, card: Card): Observable<Card>{
    return this.http.put<Card>(`${environment.apiUrl}/cards/${id}`, card)
  }
}
