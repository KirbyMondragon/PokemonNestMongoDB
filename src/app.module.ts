import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

import { AppConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    //El configuracion Root siempre va arriba
    ConfigModule.forRoot({
      load:[AppConfiguration],
      validationSchema: JoiValidationSchema
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,"..","public"),
      }),

    MongooseModule.forRoot(process.env.MONGODB, {
      dbName:'pokemonsdb'
    }),
    
    PokemonModule,
    
    CommonModule,
    
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
