import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  RpcDiscoverModule,
  RpcDiscoverController,
} from 'openrpc-nestjs-json-rpc';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';

@Module({
  imports: [
    RpcDiscoverModule,
    AuthModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
  ],
  controllers: [AppController, RpcDiscoverController],
  providers: [AppService],
})
export class AppModule {}
