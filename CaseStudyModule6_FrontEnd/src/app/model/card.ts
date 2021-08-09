import {Tag} from "./tag";
import {Member} from "./member";

export interface Card {
  id: number;
  title: string;
  content: string;
  position: number;
  tags?: Tag[];
  members?: Member[];
}
