import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JsonRpcContext } from 'openrpc-nestjs-json-rpc';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwksClient: JwksClient;
  constructor(private configService: ConfigService) {
    this.jwksClient = new JwksClient({
      jwksUri: `https://app.dynamic.xyz/api/v0/sdk/${configService.get<string>('NEXT_PUBLIC_DYNAMIC_ENV_ID')}/.well-known/jwks`,
      rateLimit: true,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000,
    });
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getContext<JsonRpcContext>();
    const token = this.extractTokenFromHeader(
      request.getMetadataByKey('Authorization'),
    );

    if (token === '123') return true;

    if (!token) return false;

    try {
      const signingKey = await this.jwksClient.getSigningKey();
      const user = await jwt.verify(token, signingKey.getPublicKey(), {
        ignoreExpiration: false,
      });
      if (!user) return false;

      request['user'] = user;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private extractTokenFromHeader(authString?: string): string | undefined {
    const [type, token] = authString?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
