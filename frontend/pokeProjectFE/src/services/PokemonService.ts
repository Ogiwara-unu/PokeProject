import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2'; // URL base de PokeAPI

// Tipos de Pokémon
interface PokemonStat {
  name: string;
  base: number;
}

interface BasicPokemon {
  id: number;
  name: string;
  url: string;
  sprite: string;
}

interface PokemonDetails extends BasicPokemon {
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BasicPokemon[];
}

interface PokemonComparison {
  pokemon1: PokemonDetails;
  pokemon2: PokemonDetails;
  differences: {
    [stat: string]: number;
  };
}

// Función utilitaria para obtener el sprite
export const getPokemonSprite = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

// Normalizar nombre de Pokémon
const normalizePokemonName = (name: string): string => {
  return name.toLowerCase().trim();
};

// Función para crear datos de fallback
const createFallbackPokemon = (identifier: string | number): PokemonDetails => {
  const id = typeof identifier === 'number' ? identifier : parseInt(identifier, 10) || 0;
  const name = typeof identifier === 'string' ? identifier : `pokemon-${identifier}`;
  
  return {
    id,
    name,
    url: `${API_URL}/pokemon/${id}`,
    sprite: getPokemonSprite(id),
    height: 0,
    weight: 0,
    types: [],
    abilities: [],
    stats: []
  };
};

// Obtener lista completa de Pokémon
export const getFullPokemonList = async (): Promise<BasicPokemon[]> => {
  try {
    const response = await axios.get(`${API_URL}/pokemon?limit=2000`);
    const results = response.data.results;

    return results.map((pokemon: any, index: number) => {
      const id = index + 1;
      return {
        id,
        name: pokemon.name,
        url: pokemon.url,
        sprite: getPokemonSprite(id)
      };
    });
  } catch (error) {
    console.error('Error al obtener lista completa:', error);
    throw error;
  }
};

// Obtener detalles de un Pokémon
export const fetchPokemonDetails = async (identifier: string | number): Promise<PokemonDetails> => {
  const key = typeof identifier === 'number' ? identifier.toString() : normalizePokemonName(identifier);

  try {
    const response = await axios.get(`${API_URL}/pokemon/${key}`);
    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      url: `${API_URL}/pokemon/${data.id}`,
      sprite: data.sprites?.other?.['official-artwork']?.front_default || getPokemonSprite(data.id),
      height: data.height / 10,
      weight: data.weight / 10,
      types: data.types.map((t: any) => t.type.name),
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        base: s.base_stat
      }))
    };
  } catch (error) {
    console.error(`Error al obtener detalles de ${key}:`, error);
    
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return createFallbackPokemon(identifier);
    }
    
    throw error;
  }
};

// Buscar Pokémon
export const searchPokemon = async (query: string): Promise<PokemonDetails[]> => {
  if (!query.trim()) return [];

  const normalizedQuery = normalizePokemonName(query);
  const isNumericSearch = !isNaN(Number(query));

  try {
    const allPokemon = await getFullPokemonList();
    const basicResults = allPokemon.filter(pokemon => {
      if (isNumericSearch) {
        return pokemon.id.toString().includes(query);
      }
      return pokemon.name.toLowerCase().includes(normalizedQuery);
    });

    const detailedResults = await Promise.all(
      basicResults.map(async pokemon => {
        try {
          return await fetchPokemonDetails(pokemon.id);
        } catch (error) {
          console.error(`Error obteniendo detalles para ${pokemon.name}:`, error);
          return null;
        }
      })
    );

    return detailedResults.filter((result): result is PokemonDetails => result !== null);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    return [];
  }
};

// Obtener lista paginada de Pokémon
export const fetchPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
  try {
    const response = await axios.get(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
    return {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: response.data.results
    };
  } catch (error) {
    console.error('Error al obtener lista paginada:', error);
    throw error;
  }
};

// Comparar Pokémon
export const comparePokemon = async (name1: string, name2: string): Promise<PokemonComparison> => {
  try {
    const [pokemon1, pokemon2] = await Promise.all([
      fetchPokemonDetails(name1),
      fetchPokemonDetails(name2)
    ]);

    const differences: {[key: string]: number} = {};

    pokemon1.stats.forEach((stat, index) => {
      if (pokemon2.stats[index]) {
        differences[stat.name] = stat.base - pokemon2.stats[index].base;
      }
    });

    return {
      pokemon1,
      pokemon2,
      differences
    };
  } catch (error) {
    console.error('Error en la comparación:', error);
    throw error;
  }
};