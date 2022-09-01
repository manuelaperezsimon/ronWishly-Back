export interface UserRegister {
  userName: string;
  password: string;
}

export interface CustomJwtPayload {
  id: string;
  userName: string;
}

export interface LoginData {
  id: string;
  userName: string;
  password: string;
}
