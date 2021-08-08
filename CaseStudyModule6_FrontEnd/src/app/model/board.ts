import {User} from "./user";
import {Column} from "./column";
import {Tag} from "./tag";

export interface Board {
  id?: number;
  title: string;
  owner: User;
  columns: Column[];
  tags?: Tag[];
}
