import React from 'react'; 
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <IonMenu side="start" menuId="main-menu" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle className='pokemon-title'>Menú</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='pokemon-content'>
        <IonList className='pokemon-list'>
           <IonItem button routerLink="/pokeSearch" className="pokemon-button">
            <span className="pokemon-arrow">▶ </span>
            <IonLabel>Busqueda Pokemon</IonLabel>
           </IonItem>

          <IonItem button routerLink='/compare' className="pokemon-button">
            <span className="pokemon-arrow">▶ </span>
            <IonLabel>Comparar Pokémons</IonLabel>
          </IonItem>
          <IonItem button className="pokemon-button">
            <span className="pokemon-arrow">▶ </span>
            <IonLabel>Favoritos</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Sidebar;