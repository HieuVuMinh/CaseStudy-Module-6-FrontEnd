import {Board} from "./board";

export interface ActivityLog {
  id?: number;
  title?: string;
  content?: string;
  url?: string;
  status?: boolean;
  board?: Board;
}
