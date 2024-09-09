import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    //Estos Pipes funcionan con toda la App con los DTOS que hemos configurado
    new ValidationPipe({
      whitelist: true,
      //Con whitelist hacemos que solo se reciban los datos que necesitamos, pero no marca errores 
      forbidNonWhitelisted: true,
      //forbidNonWhitelisted nos marca errores al enviar datos que no son requeridos por la ruta
      transform: true,
      //Transform nos ayuda a transformar la data a la que esta en los DTOs
      transformOptions: {
        enableImplicitConversion:true,
      }
    }),
  );
  
  app.setGlobalPrefix("/api/v2")
  //Con esto cambiamos la ruta de todos los endpoints agregando con prefijo lo que este metodo
  await app.listen(3000);
}

bootstrap();
