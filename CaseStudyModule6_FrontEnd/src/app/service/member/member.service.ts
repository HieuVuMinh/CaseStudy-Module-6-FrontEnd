import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DetailedMember} from '../../model/detailed-member';
import {Member} from "../../model/member";

const API_URL = `${environment.api_url}`

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private httpClient: HttpClient) {
  }

  getMembersByBoardId(id: any): Observable<DetailedMember[]> {
    return this.httpClient.get<DetailedMember[]>(`${API_URL}boards/${id}/members`);
  }

  addNewMember(member: Member): Observable<Member> {
    return this.httpClient.post<Member>(`${API_URL}members`, member);
  }

  updateMember(id: number, member: Member): Observable<Member> {
    return this.httpClient.put<Member>(`${API_URL}members/${id}`, member);
  }

  addNewMembers(members: Member[]): Observable<Member[]> {
    return this.httpClient.post<Member[]>(`${API_URL}members/all`, members);
  }

  deleteMember(id: any): Observable<Member> {
    return this.httpClient.delete<Member>(`${API_URL}members/${id}`);
  }
  deleteMemberBoardWorkspace(boardId: any, userId: any): Observable<Member> {
    return this.httpClient.delete<Member>(`${API_URL}members/${boardId}/${userId}`, );
  }
}
