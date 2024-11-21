import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JsonRpcServer } from 'openrpc-nestjs-json-rpc';
import document from 'openrpc-nestjs-json-rpc/dist/rpcdiscover/DocumentBuilder';

export async function bootstrap() {
  await NestFactory.createMicroservice(AppModule, {});
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const adapter = app.getHttpAdapter();
  app.connectMicroservice({
    strategy: new JsonRpcServer({
      path: '/rpc/v1',
      port: 8080,
      adapter,
    } as any),
  });
  document.setVersion('2.0.0');

  // fix for openrpc version
  const doc = document.getDocument();
  doc.openrpc = '1.2.6';
  document.setDocument(doc);

  await app.startAllMicroservices();
  return app;
}
bootstrap();
