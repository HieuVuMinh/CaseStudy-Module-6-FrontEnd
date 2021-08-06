
import {Board} from "./board";
import {MemberWorkspace} from "./member-workspace";

export interface Workspace {
  id: number;

  title: string;

  type: string

  owner: any;

  members: MemberWorkspace[];

  boards: Board[];
}
