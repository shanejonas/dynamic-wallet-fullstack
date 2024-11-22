import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  RpcDiscoverModule,
  RpcDiscoverController,
} from 'openrpc-nestjs-json-rpc';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RpcDiscoverModule,
    AuthModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
  ],
  controllers: [AppController, RpcDiscoverController],
  providers: [],
})
export class AppModule {}
