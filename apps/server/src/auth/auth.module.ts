import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
