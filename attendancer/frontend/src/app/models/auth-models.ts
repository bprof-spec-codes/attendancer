export interface AuthModels {
}
export interface UserRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: UserDto;
}
