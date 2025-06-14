import React, { useState, useEffect, useCallback } from 'react';
import '../../components/Poke/PokemonList.css';
import './PokeCompare.css';
import TopBar from '../../components/TopBar/TopBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import { IonContent, IonPage } from '@ionic/react';

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

  const [leftList, setLeftList] = useState<Pokemon[]>([]);
  const [rightList, setRightList] = useState<Pokemon[]>([]);
  const [leftOffset, setLeftOffset] = useState(0);
  const [rightOffset, setRightOffset] = useState(0);
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const limit = 10;

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const fetchPokemon = async (offset: number): Promise<Pokemon[]> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    const detailed = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();
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
    return detailed;
  };

  const loadLeftPokemon = async () => {
    setLeftLoading(true);
    const pokemons = await fetchPokemon(leftOffset);
    setLeftList(prev => [...prev, ...pokemons]);
    setLeftOffset(prev => prev + limit);
    setLeftLoading(false);
  };

  const loadRightPokemon = async () => {
    setRightLoading(true);
    const pokemons = await fetchPokemon(rightOffset);
    setRightList(prev => [...prev, ...pokemons]);
    setRightOffset(prev => prev + limit);
    setRightLoading(false);
  };

  useEffect(() => {
    loadLeftPokemon();
    loadRightPokemon();
  }, []);

  useEffect(() => {
    const handleScroll = (container: HTMLElement | null, loader: () => void, loading: boolean) => {
      if (!container || loading) return;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
        loader();
      }
    };

    const leftContainer = document.querySelector('.left-list') as HTMLElement;
    const rightContainer = document.querySelector('.right-list') as HTMLElement;

    const onLeftScroll = () => handleScroll(leftContainer, loadLeftPokemon, leftLoading);
    const onRightScroll = () => handleScroll(rightContainer, loadRightPokemon, rightLoading);

    leftContainer?.addEventListener('scroll', onLeftScroll);
    rightContainer?.addEventListener('scroll', onRightScroll);

    return () => {
      leftContainer?.removeEventListener('scroll', onLeftScroll);
      rightContainer?.removeEventListener('scroll', onRightScroll);
    };
  }, [leftOffset, rightOffset, leftLoading, rightLoading]);

  const visibleLeft = leftList.filter(p =>
    p.name.toLowerCase().includes(searchLeft.toLowerCase()) ||
    p.id.toString().includes(searchLeft)
  );

  const visibleRight = rightList.filter(p =>
    p.name.toLowerCase().includes(searchRight.toLowerCase()) ||
    p.id.toString().includes(searchRight)
  );

  const compareStats = (statA: number, statB: number) => {
    if (statA > statB) return 'higher';
    if (statA < statB) return 'lower';
    return '';
  };

  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <TopBar title="PokeLab" />
        <IonContent className="ion-padding">
          <div className="compare-page">
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
                  <div className="pokemon-list left-list">
                    {visibleLeft.map(pokemon => (
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
                    {leftLoading && <div className="loading-more">Cargando más Pokémon...</div>}
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
                  <div className="pokemon-list right-list">
                    {visibleRight.map(pokemon => (
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
                    {rightLoading && <div className="loading-more">Cargando más Pokémon...</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default PokeCompare;
