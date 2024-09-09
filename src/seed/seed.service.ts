import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';




@Injectable()
export class SeedService {
  constructor( @InjectModel(Pokemon.name)
  private readonly pokemonModel:Model <Pokemon>){
     
  }
  private readonly axios:AxiosInstance = axios;

  
  async executeSEED() {
    await this.pokemonModel.deleteMany({})
    // {} poner las llaves es equivalente al delete * from , osea que borramos todo de la tabla alv
    const {data} = await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650"); 

    const pokemonToInsert:{name: string , no: number}[] = [];

    data.results.forEach(async ({name, url}) => {
      const segments = url.split("/");
  
      const no = +segments[segments.length - 2];
      console.log({name, no});

     
      pokemonToInsert.push({name, no})
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return pokemonToInsert;
  }
}
