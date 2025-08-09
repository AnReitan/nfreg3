import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Menu from './Menu';
import Aksjoner from './Aksjoner';
import SisteAksjoner from '.components/sisteAksjoner';
import LeggTilBruker from './LeggTilBruker';
import Brukere from "./Brukere";
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aksjoner"
        element={
          <ProtectedRoute>
            <Aksjoner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sisteaksjoner"
        element={
          <ProtectedRoute>
            <SisteAksjoner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brukere"
        element={
          <ProtectedRoute>
            <Brukere />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leggtilbruker"
        element={
          <ProtectedRoute>
            <LeggTilBruker />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
