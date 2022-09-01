interface UserRegister {
  userName: string;
  password: string;
}

export interface CustomJwtPayload {
  id: string;
  userName: string;
}

export default UserRegister;
