import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JsonRpcContext } from 'openrpc-nestjs-json-rpc';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TypesafeKey } from 'openrpc-nestjs-json-rpc';

interface JwtPayload {
  alias: string;
  aud: string;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}

export interface DynamicJwtPayload extends JwtPayload {
  verified_credentials?: {
    address: string;
    chain: string;
    id: string;
    wallet_name: string;
  }[];
  email?: string;
  environment_id?: string;
  family_name?: string;
  given_name?: string;
  lists?: string[];
  verified_account?: {
    address?: string;
    chain?: string;
    id?: string;
    wallet_name?: string;
  };
}

export const UserInfoKey = new TypesafeKey<DynamicJwtPayload>('auth:userid');

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

    // TODO: remove this before production
    if (token === '123') return true;

    if (!token) return false;

    try {
      const signingKey = await this.jwksClient.getSigningKey();
      const user = await jwt.verify(token, signingKey.getPublicKey(), {
        ignoreExpiration: false,
      });
      if (!user) return false;

      request.customData.set(UserInfoKey, user as DynamicJwtPayload);

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
