import React from 'react';
import {
  IonFooter,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import './footer.css'; 

const Footer: React.FC = () => {
  return (
    <IonFooter className="pokemon-footer">
      <div className="footer-content">
        {/* Primera columna */}
        <div className="footer-section">
          <h3>CATEGORIAS</h3>
          <ul>
            <li>Búsqueda de Pókemon</li>
            <li>Comparación de Pokémon</li>
            <li>Pokémon a detalle</li>
            <li>Pókemon Favoritos</li>
          </ul>
        </div>

        {/* Segunda columna */}
        <div className="footer-section">
          <h3>ATENCIÓN AL CLIENTE</h3>
          <ul>
            <li>Política de Devoluciones</li>
            <li>Contacta con Nosotros</li>
            <li>Preguntas Frecuentes</li>
          </ul>

        </div>

        {/* Tercera columna */}
        <div className="footer-section">
          <h3>CREADORES</h3>
          <ul>
            <li>Randall Álvarez Chevez</li>
            <li>Valeria Fernández Carvajal</li>
            <li>Christian Cháves Villalobos</li>
          </ul>
        </div>

        {/* Cuarta columna */}

        <div className="footer-section image-section">
          <img src="/assets/pikachu.png" alt="Pokémon Footer Art" className="footer-img" />
        </div>

      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>© 2025 Pokémon. © POKELAB</p>
      </div>
    </IonFooter>
  );
};

export default Footer;