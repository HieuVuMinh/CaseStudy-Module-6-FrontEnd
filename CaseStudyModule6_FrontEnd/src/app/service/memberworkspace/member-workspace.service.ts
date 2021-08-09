import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Workspace} from "../../model/workspace";
import {environment} from "../../../environments/environment";
import {MemberWorkspace} from "../../model/member-workspace";

@Injectable({
  providedIn: 'root'
})
export class MemberWorkspaceService {

  constructor(private http: HttpClient) { }
  findById(id: any): Observable<MemberWorkspace>{
    return this.http.get<MemberWorkspace>(`${environment.api_url}member-workspace/${id}`);
  }

  update(id: any, memberWorkspace: MemberWorkspace): Observable<MemberWorkspace>{
    return this.http.put<MemberWorkspace>(`${environment.api_url}member-workspace/${id}`, memberWorkspace);
  }

  create(memberWorkspace: MemberWorkspace):Observable<MemberWorkspace>{
    return this.http.post<MemberWorkspace>(`${environment.api_url}member-workspace`, memberWorkspace)
  }
  delete(memberWorkspaces: MemberWorkspace[]):Observable<MemberWorkspace>{
    return this.http.post<MemberWorkspace>(`${environment.api_url}member-workspace/delete`,memberWorkspaces)
  }
}
