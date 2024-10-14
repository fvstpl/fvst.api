import { JwtService } from '@nestjs/jwt';

export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  verifyUserId(token: string, userId: string): boolean {
    const payload = this.decodeToken(token);
    return payload && payload.sub === userId;
  }
}
