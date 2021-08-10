import {Tag} from "./tag";
import {User} from "./user";

export interface Card {
  id: number;
  title: string;
  content: string;
  position: number;
  tags?: Tag[];
  users?: User[];
}
