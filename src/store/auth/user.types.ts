export interface IUser {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  profilePicture?: string;
  role: UserRole;
  isVerified: boolean;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  SUPER_ADMIN = "super-admin",
}
