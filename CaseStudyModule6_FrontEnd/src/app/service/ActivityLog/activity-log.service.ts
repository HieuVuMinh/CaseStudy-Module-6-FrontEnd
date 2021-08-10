import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Notification} from "../../model/notification";
import {UserToken} from "../../model/user-token";
import {AuthenticationService} from "../authentication/authentication.service";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ActivityLog} from "../../model/activity-log";
import {Board} from "../../model/board";

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

  activities: ActivityLog[] = [];
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

  findAllByBoardId(boardId: number): Observable<ActivityLog[]>{
    return this.http.get<ActivityLog[]>(`${environment.api_url}activityLog/${boardId}`);
  }
  createNotification(activity: ActivityLog): Observable<ActivityLog> {
    return this.http.post<ActivityLog>(`${environment.api_url}activityLog`,activity)
  }
  updateNotification(id: number, activity: ActivityLog):Observable<ActivityLog>{
    return this.http.put<ActivityLog>(`${environment.api_url}activityLog/${id}`,activity)
  }
  markAllAsRead(userId: number):Observable<ActivityLog>{
    return this.http.put<ActivityLog>(`${environment.api_url}activityLog`,userId)
  }
  saveNotification(activity: ActivityLog, boardId: number) {
    this.createNotification(activity).subscribe( () => {
      this.unreadNotice++;
      // @ts-ignore
      this.findAllByBoardId(boardId).subscribe( activities => this.activities = activities )
    })
  }
}
