import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Workspace} from "../model/workspace";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private http: HttpClient) { }


  findAllByOwnerId(id: number): Observable<Workspace[]>{
    return this.http.get<Workspace[]>(`${environment.api_url}workspaces/owner/${id}`);
  }
  findById(id: any): Observable<Workspace>{
    return this.http.get<Workspace>(`${environment.api_url}workspaces/${id}`);
  }

  update(id: any, workspaces: Workspace): Observable<Workspace>{
    return this.http.put<Workspace>(`${environment.api_url}workspaces/${id}`, workspaces);
  }
}
