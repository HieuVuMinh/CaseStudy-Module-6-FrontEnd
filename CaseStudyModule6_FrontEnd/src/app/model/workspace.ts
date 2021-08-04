import {User} from "./user";
import {Board} from "./board";

export interface Workspace {
  id: number;

  title: string;

  owner: any;

  users: User[];

  boards: Board[];
}
