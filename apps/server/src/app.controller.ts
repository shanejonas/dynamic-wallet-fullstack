import { UserDto, userSchema } from './app.schema.user';
import { RpcService } from 'openrpc-nestjs-json-rpc';
import { ZodToOpenRPC } from 'openrpc-nestjs-json-rpc';

@RpcService({ namespace: 'test' })
export class AppController {
  @ZodToOpenRPC({
    params: userSchema,
    result: userSchema,
  })
  public async myMethod(params: UserDto) {
    console.log('The method called was test.myMethod', params);
    return params;
  }
}
