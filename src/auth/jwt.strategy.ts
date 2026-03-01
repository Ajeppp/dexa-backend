import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Get the token from header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Must be exactly same with auth.module / .env
      secretOrKey: process.env.JWT_SECRET || 'rahasia_dexa_123',
    });
  }

  // This function run when the token is valid
  async validate(payload: any) {
    // Send back the user data (get from the payload token when logging in)
    // Ingat: di auth.service.ts, kita nyimpen ID user di properti 'sub'
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
