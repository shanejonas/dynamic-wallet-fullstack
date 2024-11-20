import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  RpcDiscoverModule,
  RpcDiscoverService,
  RpcDiscoverController,
} from 'openrpc-nestjs-json-rpc';

@Module({
  imports: [RpcDiscoverModule],
  controllers: [AppController, RpcDiscoverController],
  providers: [AppService, RpcDiscoverService],
})
export class AppModule {}
