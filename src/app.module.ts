import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ShopifyService } from './shopify.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [ShopifyService],
})
export class AppModule {}
