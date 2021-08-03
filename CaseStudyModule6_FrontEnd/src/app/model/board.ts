import {User} from "./user";
import {Column} from "./column";

export interface Board {
  id: number;
  title: string;
  owner: User;
  columns: Column[];
}
