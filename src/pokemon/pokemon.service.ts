import { BadRequestException, HttpCode, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class PokemonService {

  constructor( 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model <Pokemon>,

   ){

  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handError(error);
    }
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    
    let pokemon: Pokemon;

    if (!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no:term})
    } 

    if (!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }
    //name
    if (!pokemon){
      pokemon = await this.pokemonModel.findOne({name:term.toLowerCase().trim()})
    }
    

    if(!pokemon){
      throw new NotFoundException(`The Pokemon with ${term } don't exist`)
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);

      if(updatePokemonDto.name){
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto);

    return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handError(error);
    }
    
  }

  async remove(id: string) {
    try {
      const { deletedCount} = await this.pokemonModel.deleteOne({ _id: id});
    
      if (deletedCount === 0){
        throw new BadRequestException(`pokemon with id ${id} is not found `)
      }
  
    } catch (error) {
      throw new BadRequestException(`The id ${id} not existe`)
    }
   
    return; 
  }

  private handError(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in the database ${ JSON.stringify(error.keyValue)}`)
    } else {
      throw new InternalServerErrorException(`This is a internal, the most probably is for a duplicate id`)
    }
  }
}
