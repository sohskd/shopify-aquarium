import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { join } from 'path';
import * as exphbs from 'express-handlebars';
import express from 'express';

let cachedApp: NestExpressApplication;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
    { logger: ['error', 'warn'] }
  );

  // Configure Handlebars
  const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '..', 'views/layouts'),
    partialsDir: join(__dirname, '..', 'views/partials'),
    helpers: {
      startsWith: function(str: string, prefix: string) {
        return str && str.startsWith(prefix);
      }
    }
  });

  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', join(__dirname, '..', 'views'));

  await app.init();
  
  cachedApp = app;
  return app;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
