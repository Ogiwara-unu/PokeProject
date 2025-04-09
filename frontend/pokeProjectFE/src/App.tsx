import { Redirect, Route,Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* IMPORTACIONES DE LAS PAG */
import Home from './pages/Home';
import NotFound from './pages/NotFound/NotFound';
import PokeSearch from './pages/PokeSearch/PokeSearch';
import PokemonDetailCard from './components/Poke/PokemonDetailCard';

import Favorites from './pages/favorites/favorites';

import PokeCompare from './pages/PokeCompare/PokeCompare';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */

/* Theme variables */
import './theme/variables.css';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>

    <IonRouterOutlet>
  <Switch>
    <Route exact path="/home">
      <Home />
    </Route>
    <Route exact path="/">
      <Redirect to="/home" />
    </Route>
    <Route exact path="/search">
      <PokeSearch />
    </Route>
    <Route exact path="/details/:name" component={PokemonDetailCard} />
    <Route exact path="/favorites">
      <Favorites />
    </Route>
    <Route exact path="/compare">
      <PokeCompare />
    </Route>
    <Route path="*">
      <NotFound />
    </Route>
  </Switch>
</IonRouterOutlet>

    </IonReactRouter>
  </IonApp>
);

export default App;
