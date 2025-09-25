export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface IJwtService {
  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string>;
  generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string>;
  verifyAccessToken(token: string): Promise<JwtPayload>;
  verifyRefreshToken(token: string): Promise<JwtPayload>;
}
