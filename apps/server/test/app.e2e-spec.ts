import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JsonRpcServer } from 'openrpc-nestjs-json-rpc';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adapter: HttpServer;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    adapter = app.getHttpAdapter();
    app.connectMicroservice({
      strategy: new JsonRpcServer({
        path: '/rpc/v1',
        port: 8080,
        adapter,
      } as any),
    });
    await app.startAllMicroservices();
    await app.init();
  });

  it('call myMethod)', () => {
    return request(adapter.getInstance())
      .post('/rpc/v1')
      .set('Authorization', 'Bearer 123')
      .send({
        id: 1,
        method: 'test.myMethod',
        params: {
          age: 22,
          name: 'John Doe',
        },
      })
      .expect(200)
      .expect({
        id: 1,
        jsonrpc: '2.0',
        result: {
          age: 22,
          name: 'John Doe',
        },
      });
  });
});
