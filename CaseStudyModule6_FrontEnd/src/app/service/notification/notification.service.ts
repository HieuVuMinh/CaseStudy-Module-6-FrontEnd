import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Notification} from "../../model/notification";
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification: Notification[] = [];
  unreadNotice:number = 0;
  currentUser: UserToken = this.authenticationService.getCurrentUserValue();
  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {  }

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
  markAllAsRead(userId: number):Observable<Notification>{
    return this.http.put<Notification>(`${environment.api_url}notifications/read-all`,userId)
  }
  saveNotification(notification: Notification) {
    this.createNotification(notification).subscribe( () => {
      // @ts-ignore
      this.findAllByUser(this.currentUser.id).subscribe( notifications => this.notification = notifications )
    })
  }
}
