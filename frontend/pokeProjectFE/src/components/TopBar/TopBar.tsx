// src/components/TopBar/TopBar.tsx
import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuToggle,
  IonIcon,
  IonRouterLink // Importa IonRouterLink
} from '@ionic/react';
import { menuOutline } from 'ionicons/icons';
import './TopBar.css';

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'PokeLab' }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuToggle menu="main-menu">
            <IonButton fill="clear">
              <IonIcon 
                icon={menuOutline} 
                slot="start"
                className="menu-icon" 
              />
            </IonButton>
          </IonMenuToggle>
        </IonButtons>

        <div className="title-container">
          <IonRouterLink routerLink="/home" routerDirection="forward"> {/* Ruta al home */}
            <IonTitle className='pokemon-title'>
              {title}
            </IonTitle>
          </IonRouterLink>
        </div>

        <IonButtons slot="end">
          <IonRouterLink routerLink="/home" routerDirection="forward"> {/* Ruta al home */}
            <img 
              src="/assets/pokemon.png" 
              alt="Pokémon Logo"
              className="pokemon-logo" 
            />
          </IonRouterLink>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default TopBar;