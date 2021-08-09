import {Member} from "./member";
import {Card} from "./card";

export interface CommentCard {
  id?: number;
  content?: string;
  member?: Member;
  card?: Card;
}
