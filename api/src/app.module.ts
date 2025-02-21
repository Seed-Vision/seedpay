
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './auth/controllers/models/user.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/all-exceptions.filter';
import { MailerModule } from './mailer/mailer.module';
import { FeexpayModule } from './feexpay/feexpay.module';

@Module({
  //**configuration base de donnée postgres */
  imports: [
    ConfigModule.forRoot({ isGlobal : true }),  // Config globale pour les variables d'environnement
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,    // Ne pas utiliser en production sans précautions
    }),
    FeedModule,
    AuthModule,
     UserModule,
     MailerModule,
     FeexpayModule, 
  ],
  controllers: [AppController],  // Gère le contrôleur principal
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter
  }],  // Fournisseur de services
})
export class AppModule {}
