export interface IUser {
  id: string;
  name: string;
  email: string;
  attachment: string | null;
}

export interface IUserDto {
  name: string;
  email: string;
}
