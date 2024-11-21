import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  RpcDiscoverModule,
  RpcDiscoverService,
  RpcDiscoverController,
} from 'openrpc-nestjs-json-rpc';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RpcDiscoverModule, AuthModule],
  controllers: [AppController, RpcDiscoverController],
  providers: [AppService, RpcDiscoverService],
})
export class AppModule {}
