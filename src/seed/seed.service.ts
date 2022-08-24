import { Injectable } from '@nestjs/common';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { PokemonResponse } from './interfaces/Poke-response.interface';

interface PokemonResult {
  name: string;
  url: string;
}

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) { }

  async executeSeed() {
    await this.pokemonModel.deleteMany();

    const data = await this.http.get<PokemonResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }: PokemonResult) => {
      const segments = url.split('/').slice(-2)[0];
      const no: number = +segments;

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return data;
  }
}
