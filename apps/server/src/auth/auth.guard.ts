import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JsonRpcContext } from 'openrpc-nestjs-json-rpc';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getContext<JsonRpcContext>();
    const token = this.extractTokenFromHeader(
      request.getMetadataByKey('Authorization'),
    );

    // TODO: remove test token
    if (token === '123') return true;

    if (!token) return false;

    const user = await this.authService.verify(token);
    if (!user) return false;

    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(authString?: string): string | undefined {
    const [type, token] = authString?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
