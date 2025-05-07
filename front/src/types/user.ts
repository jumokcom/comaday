export interface User {
  id: number;
  username: string;
  email?: string;
  coinCount: number;
  isAdmin: boolean;
  isGuest: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 