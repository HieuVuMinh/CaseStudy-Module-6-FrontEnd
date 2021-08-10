import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Attachment} from "../../model/attachment";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private httpClient: HttpClient) {
  }

  addNewFile(attachment: Attachment): Observable<Attachment> {
    return this.httpClient.post<Attachment>(`${API_URL}attachments`, attachment);
  }

  getAttachmentByCard(cardId : number): Observable<Attachment[]>{
    return this.httpClient.get<Attachment[]>(`${API_URL}attachments/card/${cardId}`);
  }

  deleteAttachmentById(id: any): Observable<Attachment>{
    return this.httpClient.delete<Attachment>(`${API_URL}attachments/${id}`);
  }
}
