import {Member} from "./member";
import {Card} from "./card";

export interface Attachment {
  id?: number;
  member?: Member;
  source?: string;
  card?: Card;
}
