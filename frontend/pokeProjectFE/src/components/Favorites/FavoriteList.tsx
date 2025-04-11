import React, { useEffect, useState } from 'react';
import { 
  IonCard, IonCardContent, IonImg, IonNote, IonContent, 
  IonToolbar, IonButton, IonIcon 
} from '@ionic/react';
import { star } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { fetchPokemonDetails } from '../../services/PokemonService';
import './favoriteList.css';

interface FavoritePokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

const FavoriteList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const history = useHistory();

  // Cargar favoritos al iniciar
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesStr = localStorage.getItem('pokemonFavorites');
        const favoriteIds = favoritesStr ? JSON.parse(favoritesStr) : [];
        
        const favoritePokemons = await Promise.all(
          favoriteIds.map(async (id: number) => {
            const details = await fetchPokemonDetails(id.toString());
            return {
              id: details.id,
              name: details.name,
              sprite: details.sprite,
              types: details.types
            };
          })
        );
        
        setFavorites(favoritePokemons);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (pokemonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Actualizar localStorage
    const updatedFavorites = favorites.filter(p => p.id !== pokemonId);
    const updatedFavoriteIds = updatedFavorites.map(p => p.id);
    localStorage.setItem('pokemonFavorites', JSON.stringify(updatedFavoriteIds));
    
    // Actualizar estado
    setFavorites(updatedFavorites);
  };

  const handlePokemonClick = (pokemon: FavoritePokemon) => {
    history.push(`/details/${pokemon.name}`);
  };

  if (loading) {
    return (
      <IonContent className="pokemon-grid">
        <div className="pokemon-grid-container">
          {[...Array(8)].map((_, i) => (
            <IonCard key={`skeleton-${i}`} className="pokemon-card">
              <IonCardContent className="pokemon-card-content">
                <div className="pokemon-card-header">
                  <div className="pokemon-number">
                    N° 0000
                  </div>
                  <IonButton fill="clear" className="favorite-button">
                    <IonIcon icon={star} color="warning" />
                  </IonButton>
                </div>
                <div className="pokemon-card-content-wrapper">
                  <div className="pokemon-image-container">
                    <div className="pokemon-image-frame"></div>
                  </div>
                  <div className="pokemon-name-container">
                    Loading...
                  </div>
                  <div className="pokemon-types-container">
                    <div className="pokemon-type-badge type-normal">---</div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    );
  }

  return (
    <IonContent className="pokemon-grid">
      <IonToolbar>
        <h2 className="favorite-title">Mis Pokémon Favoritos</h2>
      </IonToolbar>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <IonNote>No tienes Pokémon favoritos aún</IonNote>
        </div>
      ) : (
        <div className="pokemon-grid-container">
          {favorites.map(pokemon => (
            <IonCard 
              key={pokemon.id} 
              className="pokemon-card"
              onClick={() => handlePokemonClick(pokemon)}
            >
              <div className="pokemon-card-header">
                <div className="pokemon-number">
                  N° {pokemon.id.toString().padStart(4, '0')}
                </div>
                <IonButton 
                  fill="clear" 
                  className="favorite-button"
                  onClick={(e) => removeFavorite(pokemon.id, e)}
                >
                  <IonIcon 
                    icon={star} 
                    color="warning" 
                  />
                </IonButton>
              </div>
              
              <div className="pokemon-card-content-wrapper">
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
      )}
    </IonContent>
  );
};

export default FavoriteList;