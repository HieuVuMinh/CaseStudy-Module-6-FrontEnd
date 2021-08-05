import {User} from "./user";
import {Board} from "./board";

export interface Workspace {
  id: number;

  title: string;

  type: string

  owner: any;

  members: User[];

  boards: Board[];
}
