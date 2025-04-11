import { 
  IonCard, IonCardContent, IonImg, IonBadge, IonNote, IonContent, 
  IonSearchbar, IonToolbar, IonSkeletonText, IonButton, IonIcon 
} from '@ionic/react';
import { fetchPokemonList, searchPokemon, fetchPokemonDetails, getPokemonSprite } from '../../services/PokemonService';
import { useState, useEffect, useRef, useCallback } from 'react';
import { star, starOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './PokemonList.css';

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  url: string;
  types: string[];
  height?: number;
  weight?: number;
  abilities?: string[];
  stats?: {
    name: string;
    base: number;
  }[];
}

interface PokemonListProps {
  onListLoaded?: (list: Pokemon[]) => void;
  showCompareButton?: boolean;
  onPokemonSelected?: (pokemon: Pokemon) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ 
  onListLoaded, 
  showCompareButton = false,
  onPokemonSelected 
}) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const limit = 16;
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const history = useHistory();

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (pokemonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prevFavorites => {
      let newFavorites;
      if (prevFavorites.includes(pokemonId)) {
        newFavorites = prevFavorites.filter(id => id !== pokemonId);
      } else {
        newFavorites = [...prevFavorites, pokemonId];
      }
      localStorage.setItem('pokemonFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const loadPokemons = useCallback(async (newOffset: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPokemonList(limit, newOffset);
      
      // Cargar detalles completos para cada Pokémon
      const detailedPokemons = await Promise.all(
        data.results.map(async (p: any) => {
          const id = parseInt(p.url.split('/').filter(Boolean).pop());
          try {
            const details = await fetchPokemonDetails(id);
            return {
              id: details.id,
              name: details.name,
              sprite: details.sprite,
              url: details.url,
              types: details.types,
              height: details.height,
              weight: details.weight,
              abilities: details.abilities,
              stats: details.stats
            };
          } catch (error) {
            console.error(`Error loading details for Pokémon ${id}:`, error);
            return {
              id,
              name: p.name,
              sprite: getPokemonSprite(id),
              url: p.url,
              types: [],
              height: 0,
              weight: 0,
              abilities: [],
              stats: []
            };
          }
        })
      );
      
      setPokemonList(detailedPokemons);
      setFilteredList(detailedPokemons);
      
      if (onListLoaded) {
        onListLoaded(detailedPokemons);
      }
    } catch (err) {
      console.error("Error loading Pokémon:", err);
      setError('Error al cargar Pokémon');
      setPokemonList([]);
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  }, [onListLoaded]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchText(query);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setIsSearching(false);
      setFilteredList(pokemonList);
      return;
    }

    setIsSearching(true);
    setLoading(true);

    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchPokemon(query);
        const formattedResults = results.map((p: any) => ({
          id: p.id,
          name: p.name,
          sprite: p.sprite,
          url: p.url,
          types: p.types || [],
          height: p.height,
          weight: p.weight,
          abilities: p.abilities || [],
          stats: p.stats || []
        }));
        
        setFilteredList(formattedResults);
      } catch (err) {
        console.error("Error searching Pokémon:", err);
        setError('Error al buscar Pokémon');
        setFilteredList([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [pokemonList]);

  useEffect(() => {
    loadPokemons(offset);
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [offset, loadPokemons]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    if (onPokemonSelected) {
      onPokemonSelected(pokemon);
    }
    if (!showCompareButton) {
      history.push(`/details/${pokemon.name}`);
    }
  };

  return (
    <IonContent className="pokemon-grid">
      <IonToolbar>
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => handleSearch(e.detail.value!)}
          placeholder="Buscar Pokémon por nombre o número"
          animated
          className="pokemon-searchbar"
        />
      </IonToolbar>

      {loading && (
        <div className="pokemon-grid-container">
          {[...Array(16)].map((_, i) => (
            <IonCard key={`skeleton-${i}`} className="pokemon-card">
              <IonCardContent className="pokemon-card-content">
                <IonSkeletonText animated style={{ width: '60%', height: '16px' }} />
                <IonSkeletonText 
                  animated 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    margin: '12px auto',
                    borderRadius: '50%'
                  }} 
                />
                <IonSkeletonText animated style={{ width: '80%', height: '20px', margin: '12px auto' }} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                  <IonSkeletonText animated style={{ width: '50px', height: '20px' }} />
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="ion-padding ion-text-center">
          <IonNote color="danger">{error}</IonNote>
          <IonButton 
            onClick={() => isSearching ? handleSearch(searchText) : loadPokemons(offset)}
            fill="clear"
            size="small"
          >
            Reintentar
          </IonButton>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="pokemon-grid-container">
            {filteredList.map((pokemon) => (
              <IonCard 
                key={pokemon.id}
                className="pokemon-card"
                button={false}
              >
                <div className="pokemon-card-header">
                  <div className="pokemon-number">
                    N° {pokemon.id.toString().padStart(4, '0')}
                  </div>
                  <IonButton 
                    fill="clear" 
                    className="favorite-button"
                    onClick={(e) => toggleFavorite(pokemon.id, e)}
                  >
                    <IonIcon 
                      icon={favorites.includes(pokemon.id) ? star : starOutline} 
                      color={favorites.includes(pokemon.id) ? 'warning' : 'medium'}
                    />
                  </IonButton>
                </div>
                
                <div className="pokemon-card-content-wrapper" onClick={() => handlePokemonClick(pokemon)}>
                  <IonCardContent className="pokemon-card-content">
                    <div className="pokemon-image-container">
                      <div className="pokemon-image-frame">
                        <IonImg 
                          src={pokemon.sprite}
                          className="pokemon-sprite"
                          alt={`${pokemon.name} sprite`}
                        />
                      </div>
                    </div>
                    <div className="pokemon-name-container">
                      {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </div>
                    
                    <div className="pokemon-types-container">
                      {pokemon.types.map((type, index) => (
                        <div 
                          key={index}
                          className={`pokemon-type-badge type-${type.toLowerCase()}`}
                        >
                          {type.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </div>
              </IonCard>
            ))}
          </div>

          {!isSearching && filteredList.length > 0 && (
            <div className="pagination-container">
              <IonButton 
                className="pagination-button"
                onClick={() => setOffset(prev => Math.max(0, prev - limit))} 
                disabled={offset === 0 || loading}
                fill="solid"
              >
                ANTERIOR
              </IonButton>
              <IonButton 
                className="pagination-button"
                onClick={() => setOffset(prev => prev + limit)}
                disabled={loading}
                fill="solid"
              >
                SIGUIENTE
              </IonButton>
            </div>
          )}
        </>
      )}
    </IonContent>
  );
};

export default PokemonList;