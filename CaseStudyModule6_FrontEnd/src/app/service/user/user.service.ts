import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {User} from "../../model/user";
import {HttpClient} from "@angular/common/http";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}users/${id}`);
  }

  getUserByUserNameAndNickName(username: string, nickname: string): Observable<User> {
    return this.http.post<User>(API_URL + 'users/recoverpassword', {username, nickname})
  }

    updateById(id: number, user: User): Observable<any> {
    return this.http.put<any>(`${API_URL}users/${id}`, user);
  }

  findUsersByKeyword(keyword: string): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}users/search/${keyword}`);
  }
}
