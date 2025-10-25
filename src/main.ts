import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as exphbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
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
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();
