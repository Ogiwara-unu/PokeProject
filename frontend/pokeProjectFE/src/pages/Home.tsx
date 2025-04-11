import React from 'react';
import {
  IonApp,
  IonContent,
  IonPage,
} from '@ionic/react';
import Sidebar from '../components/Sidebar/Sidebar';
import TopBar from '../components/TopBar/TopBar';
import Footer from '../components/Footer/footer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonApp>
      <Sidebar />
      
      <IonPage id="main-content">
        <TopBar title="PokeLab" />

        <IonContent fullscreen className="video-content">
          <div className="video-container">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="background-video">
              <source src='/assets/Video1.mp4' type="video/mp4" />
              Tu navegador no soporta el video.
            </video>

            <div className="video-overlay">
              <p className="overlay-text">
                Bienvenido al PokeLab, tu laboratorio digital donde la ciencia y la aventura se encuentran.
                Sumérgete en un universo lleno de criaturas extraordinarias, descubre sus habilidades,
                analiza sus estadísticas y construye tu propio equipo de Pokémon como un verdadero maestro investigador.
              </p>
              <p className="overlay-text">¡El conocimiento es poder y cada descubrimiento te acerca más a convertirte en el mejor!</p>

              <button className="search-button">Buscar</button>
            </div>
          </div>
          
          <section className="promo-section">
          <p className="promo-description tracking-out-expand">Compara tus Pokémon favoritos</p>
          <button className="promo-button">Comparar</button>
            <div className="fleece-grid">
              <div className="fleece-left">
                <img src="/assets/fleece1.jpg" alt="Pokémon Fleece 1" className="fleece-img" />
                <img src="/assets/fleece3.png" alt="Pokémon Fleece 2" className="fleece-img" />
                <img src="/assets/fleece2.jpg" alt="Pokémon Fleece 3" className="fleece-img" />
              </div>
              <div className="fleece-right">
                <img src="/assets/fleece4.png" alt="Pokémon Fleece Featured" className="fleece-featured-img" />
              </div>
            </div>
            
          </section>
          <Footer />
        </IonContent>

        
      </IonPage>
    </IonApp>
  );
};

export default Home;