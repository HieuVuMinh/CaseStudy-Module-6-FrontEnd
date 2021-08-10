import {Member} from "./member";
import {Card} from "./card";
import {Reply} from "./reply";

export interface CommentCard {
  id?: number;
  content?: string;
  member?: Member;
  card?: Card;
  replies?: Reply[];
}
