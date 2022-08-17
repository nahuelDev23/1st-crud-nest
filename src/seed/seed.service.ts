import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponse } from './interfaces/Poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';

interface PokemonResult {
  name: string;
  url: string;
}

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokemonResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    data.results.forEach(({ name, url }: PokemonResult) => {
      const segments = url.split('/').slice(-2)[0];
      const no: number = +segments;

      console.log(segments);
    });
    return data;
  }
}
