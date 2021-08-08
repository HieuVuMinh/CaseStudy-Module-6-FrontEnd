import {Tag} from "./tag";

export interface Card {
  id: number;
  title: string;
  content: string;
  position: number;
  tags?: Tag[];
}
