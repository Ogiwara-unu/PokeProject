import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import FavoriteList from '../../components/Favorites/FavoriteList';
import Sidebar from '../../components/Sidebar/Sidebar';
import TopBar from '../../components/TopBar/TopBar';

const Favorites: React.FC = () => {
  const history = useHistory();
  return (
    <>
      <Sidebar /> {/* Menú lateral */}
      
      <IonPage id="main-content">
        <TopBar title="PokeLab" /> {/* Barra superior con título */}
        
        <IonContent fullscreen>
          <FavoriteList />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Favorites;