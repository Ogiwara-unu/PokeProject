import React, { useState, useEffect } from 'react';
import '../../components/Poke/PokemonList.css';
import './PokeCompare.css';


type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
};

const PokeCompare = () => {
  const [leftPokemon, setLeftPokemon] = useState<Pokemon | null>(null);
  const [rightPokemon, setRightPokemon] = useState<Pokemon | null>(null);
  const [searchLeft, setSearchLeft] = useState('');
  const [searchRight, setSearchRight] = useState('');
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 1000; // Número de Pokémon a cargar por lote

  // Función para cargar más Pokémon
  const loadMorePokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }

      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const detailsResponse = await fetch(pokemon.url);
          const details = await detailsResponse.json();
          
          return {
            id: details.id,
            name: details.name,
            sprite: details.sprites.front_default || 'https://via.placeholder.com/96',
            types: details.types.map((t: any) => t.type.name),
            stats: {
              hp: details.stats[0].base_stat,
              attack: details.stats[1].base_stat,
              defense: details.stats[2].base_stat,
              'special-attack': details.stats[3].base_stat,
              'special-defense': details.stats[4].base_stat,
              speed: details.stats[5].base_stat
            }
          };
        })
      );

      setAllPokemon(prev => [...prev, ...detailedPokemon]);
      setOffset(prev => prev + limit);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar primeros Pokémon al montar
  useEffect(() => {
    loadMorePokemon();
  }, []);

  // Manejar scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== 
        document.documentElement.offsetHeight || 
        loading || 
        !hasMore
      ) {
        return;
      }
      loadMorePokemon();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const filteredLeft = allPokemon.filter(p => 
    p.name.toLowerCase().includes(searchLeft.toLowerCase()) || 
    p.id.toString().includes(searchLeft)
  );

  const filteredRight = allPokemon.filter(p => 
    p.name.toLowerCase().includes(searchRight.toLowerCase()) || 
    p.id.toString().includes(searchRight)
  );

  const compareStats = (statA: number, statB: number) => {
    if (statA > statB) return 'higher';
    if (statA < statB) return 'lower';
    return '';
  };

  return (
    <div className="compare-page">
      <h1 className="compare-title">Comparador de Pokémon</h1>
      
      <div className="comparison-wrapper">
        <div className="comparison-container">
          {/* Columna izquierda */}
          <div className="selection-column">
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchLeft}
              onChange={(e) => setSearchLeft(e.target.value)}
              className="search-input"
            />
            
            <div className="pokemon-list">
              {filteredLeft.map(pokemon => (
                <div 
                  key={pokemon.id} 
                  className={`pokemon-card ${leftPokemon?.id === pokemon.id ? 'selected' : ''}`}
                  onClick={() => setLeftPokemon(pokemon)}
                >
                  <div className="pokemon-number">#{pokemon.id.toString().padStart(4, '0')}</div>
                  <img 
                    src={pokemon.sprite} 
                    alt={pokemon.name} 
                    className="pokemon-sprite" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96';
                    }}
                  />
                  <div className="pokemon-name">{pokemon.name}</div>
                  <div className="pokemon-types">
                    {pokemon.types.map(type => (
                      <span key={type} className={`type-badge type-${type}`}>{type}</span>
                    ))}
                  </div>
                </div>
              ))}
              {loading && <div className="loading-more">Cargando más Pokémon...</div>}
            </div>
          </div>

          {/* Comparación central */}
          <div className="vs-container">
            <div className="vs">VS</div>
            
            {leftPokemon && rightPokemon && (
              <div className="stats-comparison">
                {Object.entries(leftPokemon.stats).map(([stat, value]) => (
                  <div key={stat} className="stat-row">
                    <span className={`stat-value left ${compareStats(value, rightPokemon.stats[stat as keyof typeof rightPokemon.stats])}`}>
                      {value}
                    </span>
                    <span className="stat-name">{stat.replace('-', ' ')}</span>
                    <span className={`stat-value right ${compareStats(rightPokemon.stats[stat as keyof typeof rightPokemon.stats], value)}`}>
                      {rightPokemon.stats[stat as keyof typeof rightPokemon.stats]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div className="selection-column">
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchRight}
              onChange={(e) => setSearchRight(e.target.value)}
              className="search-input"
            />
            
            <div className="pokemon-list">
              {filteredRight.map(pokemon => (
                <div 
                  key={pokemon.id} 
                  className={`pokemon-card ${rightPokemon?.id === pokemon.id ? 'selected' : ''}`}
                  onClick={() => setRightPokemon(pokemon)}
                >
                  <div className="pokemon-number">#{pokemon.id.toString().padStart(4, '0')}</div>
                  <img 
                    src={pokemon.sprite} 
                    alt={pokemon.name} 
                    className="pokemon-sprite" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96';
                    }}
                  />
                  <div className="pokemon-name">{pokemon.name}</div>
                  <div className="pokemon-types">
                    {pokemon.types.map(type => (
                      <span key={type} className={`type-badge type-${type}`}>{type}</span>
                    ))}
                  </div>
                </div>
              ))}
              {loading && <div className="loading-more">Cargando más Pokémon...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokeCompare;