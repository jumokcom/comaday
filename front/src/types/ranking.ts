export interface RankingUser {
  id: number;
  username: string;
  memberNumber: string;
  coinCount: number;
  rank: number;
}

export interface Ranking {
  id: number;
  userId: number;
  username: string;
  score: number;
  createdAt: Date;
} 