import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Notification} from "../../model/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification: Notification[] = [];

  constructor(private http: HttpClient) {  }

  getTime(){
    let today = new Date();
    let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return  time + ' ' + date;
  }

  findAllByUser(userId: number): Observable<Notification[]>{
    return this.http.get<Notification[]>(`${environment.api_url}notifications/${userId}`);
  }
  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${environment.api_url}notifications`,notification)
  }
  updateNotification(id: number, notification: Notification):Observable<Notification>{
    return this.http.put<Notification>(`${environment.api_url}notifications/${id}`,notification)
  }
}
