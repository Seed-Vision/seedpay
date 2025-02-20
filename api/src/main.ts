import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as fs from 'fs';
import * as morgan from 'morgan';
import { stream } from 'file-type';
import { AppModule } from './app.module';
import { MulterExceptionFilter } from './filters/MulterExceptionFilter';
import { AllExceptionsFilter } from './core/all-exceptions.filter';



//envie de suivre les log avec morgan
const logStream = fs.createWriteStream('omertaa.log' , {
    flags: 'a', // append
})


async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'warn', 'debug', 'verbose'], // Exclut 'error'
    });

    app.enableCors();
    app.setGlobalPrefix('omertaa');
    app.useGlobalPipes(new ValidationPipe());
    //affichage des log dans le terminal pour raison de sécurité j'ai commenté
    // app.use(morgan('dev'));
    // app.use(morgan('combined', { stream : logStream}))
    app.use(morgan('tiny', { stream : logStream}))

    // Applique les filtres globalement
    app.useGlobalFilters(new MulterExceptionFilter(), new AllExceptionsFilter());

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
