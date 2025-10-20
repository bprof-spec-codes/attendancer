export interface JwtPayload {
  sub?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  exp?: number;
}
