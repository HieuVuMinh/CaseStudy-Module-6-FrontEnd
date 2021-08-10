import {Member} from "./member";

export interface Reply {
  id?: number;
  content?: string
  member?: Member
}
