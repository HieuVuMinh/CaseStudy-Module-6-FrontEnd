import {User} from "./user";
import {Board} from "./board";

export interface Member {
  id?: number;
  user: User;
  canEdit?: boolean;
  board: Board;
}
