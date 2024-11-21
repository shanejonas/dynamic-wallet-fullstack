import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  verify(token: string): any {
    const publicKey = this.configService.get<string>('PUBLIC_KEY');
    return jwt.verify(token, { publicKey, algorithms: ['RS256'] });
  }
}
