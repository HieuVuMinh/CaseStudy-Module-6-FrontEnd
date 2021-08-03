import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user";
import {Observable} from "rxjs";

const API_URL = `${environment.api_url}`;

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  createUser(user: User):Observable<User>{
    return this.http.post<User>(`${API_URL}users`, user)
  }

}
