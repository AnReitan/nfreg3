import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Menu from './Menu';
import Aksjoner from './Aksjoner';
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
    </Routes>
  );
}

export default App;
