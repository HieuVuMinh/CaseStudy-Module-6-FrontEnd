export interface DetailedMember {
  id: number;
  canEdit: boolean;
  boardId: number;
  userId: number;
  username: string;
  nickname?: string;
  image?: string;
}
