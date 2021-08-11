import {Board} from "./board";
import {Card} from "./card";
import {Column} from "./column";

export interface SearchResult {
  board: Board,
  column: Column,
  card: Card,
  preview: string[],
}
