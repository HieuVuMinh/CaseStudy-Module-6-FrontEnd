import { Injectable } from '@angular/core';
import {AuthenticationService} from "../authentication/authentication.service";
import {UserToken} from "../../model/user-token";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  currentUser: UserToken = {};
  isActive: boolean = false;

  constructor(private authenticationService: AuthenticationService) { }

  show() {
    this.isActive = true;
    this.currentUser = this.authenticationService.getCurrentUserValue();
  }

  close() {
    this.isActive = false;
  }
}
