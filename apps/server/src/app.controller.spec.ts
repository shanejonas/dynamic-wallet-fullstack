import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DynamicJwtPayload, UserInfoKey } from './auth/auth.guard';
import { TypesafeMap } from 'openrpc-nestjs-json-rpc/dist/typesafe-map';
import { JsonRpcContext } from 'openrpc-nestjs-json-rpc';
import { AppService } from './app.service';

class AppServiceMock {
  public async createWallet() {
    return {
      address: '0x0000000000000000000000000000000000000000',
      name: 'test wallet',
    };
  }

  public async getBalance() {
    return '0x1';
  }

  public async sendTransaction() {
    return '0x1';
  }

  public async signMessage() {
    return '0x1';
  }

  public async getWallet() {
    return {
      address: '0x0000000000000000000000000000000000000000',
      name: 'test wallet',
    };
  }
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useClass: AppServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the created wallet', async () => {
      expect(
        await appController.create(
          {
            name: 'test wallet',
          },
          {
            customData: new TypesafeMap().set(UserInfoKey, {
              sub: '123',
            } as DynamicJwtPayload),
          } as JsonRpcContext,
        ),
      ).toStrictEqual({
        address: expect.stringMatching(/^0x[a-fA-F0-9]{40}$/),
        name: 'test wallet',
      });
    });
    it('should return the balance', async () => {
      expect(
        await appController.getBalance({}, {
          customData: new TypesafeMap().set(UserInfoKey, {
            sub: '123',
          } as DynamicJwtPayload),
        } as JsonRpcContext),
      ).toStrictEqual('0x1');
    });
    it('should return the signed message', async () => {
      expect(
        await appController.signMessage(
          {
            message: 'foo',
          },
          {
            customData: new TypesafeMap().set(UserInfoKey, {
              sub: '123',
            } as DynamicJwtPayload),
          } as JsonRpcContext,
        ),
      ).toStrictEqual('0x1');
    });
    it('should return the sent transaction', async () => {
      expect(
        await appController.sendTransaction(
          {
            value: '0x1',
            to: '0x0000000000000000000000000000000000000000',
          },
          {
            customData: new TypesafeMap().set(UserInfoKey, {
              sub: '123',
            } as DynamicJwtPayload),
          } as JsonRpcContext,
        ),
      ).toStrictEqual('0x1');
    });
    it('should return the wallet', async () => {
      expect(
        await appController.accounts({}, {
          customData: new TypesafeMap().set(UserInfoKey, {
            sub: '123',
          } as DynamicJwtPayload),
        } as JsonRpcContext),
      ).toStrictEqual({
        address: '0x0000000000000000000000000000000000000000',
        name: 'test wallet',
      });
    });
  });
});
