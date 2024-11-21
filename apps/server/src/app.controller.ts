import { UserDto, userSchema } from '@repo/schemas';
import { RpcService } from 'openrpc-nestjs-json-rpc';
import { ZodToOpenRPC } from 'openrpc-nestjs-json-rpc';
import { AuthGuard } from './auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@RpcService({ namespace: 'test' })
export class AppController {
  @UseGuards(AuthGuard)
  @ZodToOpenRPC({
    params: userSchema,
    result: userSchema,
  })
  public async myMethod(params: UserDto) {
    console.log('The method called was test.myMethod', params);
    return params;
  }
}
