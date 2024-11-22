import {
  accountParamsSchema,
  accountResultSchema,
  CreateWalletDto,
  CreateWalletResultDto,
  createWalletResultSchema,
  createWalletSchema,
  GetBalanceResultDto,
  getBalanceResultSchema,
  getBalanceSchema,
  SendTransactionDto,
  SendTransactionResultDto,
  sendTransactionResultSchema,
  sendTransactionSchema,
  SignMessageDto,
  SignMessageResultDto,
  signMessageResultSchema,
  signMessageSchema,
} from '@repo/schemas';
import { CodedRpcException, RpcService } from 'openrpc-nestjs-json-rpc';
import { ZodToOpenRPC } from 'openrpc-nestjs-json-rpc';
import { AuthGuard, UserInfoKey } from './auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { JsonRpcContext } from 'openrpc-nestjs-json-rpc';
import { AppService } from './app.service';
import { Ctx } from '@nestjs/microservices';
import { Body } from '@nestjs/common';

@RpcService({ namespace: 'wallet' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ZodToOpenRPC({
    params: createWalletSchema,
    result: createWalletResultSchema,
  })
  @UseGuards(AuthGuard)
  public async create(
    @Body() params: CreateWalletDto,
    @Ctx() ctx: JsonRpcContext,
  ): Promise<CreateWalletResultDto> {
    const userData = ctx.customData.get(UserInfoKey);
    let result: CreateWalletResultDto;
    try {
      result = await this.appService.createWallet(params.name, userData.sub);
    } catch (error: unknown) {
      throw new CodedRpcException(
        `Failed to create wallet: ${(error as Error).message}`,
        600,
      );
    }
    return result;
  }

  @UseGuards(AuthGuard)
  @ZodToOpenRPC({
    params: getBalanceSchema,
    result: getBalanceResultSchema,
  })
  public async getBalance(
    params: object,
    @Ctx() ctx: JsonRpcContext,
  ): Promise<GetBalanceResultDto> {
    const userData = ctx.customData.get(UserInfoKey);
    let result: GetBalanceResultDto;
    try {
      result = await this.appService.getBalance(userData.sub);
    } catch (error: unknown) {
      console.error('Failed to get balance:', error);
      throw new CodedRpcException(
        'Failed to get balance. Try creating a new wallet first.',
        601,
      );
    }
    return result;
  }

  @ZodToOpenRPC({
    params: signMessageSchema,
    result: signMessageResultSchema,
  })
  @UseGuards(AuthGuard)
  public async signMessage(
    @Body() params: SignMessageDto,
    @Ctx() ctx: JsonRpcContext,
  ): Promise<SignMessageResultDto> {
    const userData = ctx.customData.get(UserInfoKey);
    let result: SignMessageResultDto;
    try {
      result = await this.appService.signMessage(params.message, userData.sub);
    } catch (error: unknown) {
      throw new CodedRpcException(
        `Failed to sign message: ${(error as Error).message}`,
        602,
      );
    }
    return result;
  }

  @ZodToOpenRPC({
    params: sendTransactionSchema,
    result: sendTransactionResultSchema,
  })
  @UseGuards(AuthGuard)
  public async sendTransaction(
    @Body() params: SendTransactionDto,
    @Ctx() ctx: JsonRpcContext,
  ): Promise<SendTransactionResultDto> {
    const userData = ctx.customData.get(UserInfoKey);
    let result: SendTransactionResultDto;
    try {
      result = await this.appService.sendTransaction(
        params.to as `0x${string}`,
        BigInt(params.value),
        userData.sub,
      );
    } catch (error: unknown) {
      throw new CodedRpcException(
        `Failed to send transaction: ${(error as Error).message}`,
        603,
      );
    }
    return result;
  }

  @ZodToOpenRPC({
    params: accountParamsSchema,
    result: accountResultSchema,
  })
  @UseGuards(AuthGuard)
  public accounts(params: object, @Ctx() ctx: JsonRpcContext) {
    const userData = ctx.customData.get(UserInfoKey);
    try {
      return this.appService.getWallet(userData.sub);
    } catch (error: unknown) {
      console.error('Failed to get wallet:', error);
      throw new CodedRpcException(
        `Failed to get wallet. Try creating a new wallet first.`,
        604,
      );
    }
  }
}
