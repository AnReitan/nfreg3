import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Menu from './Menu';
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
    </Routes>
  );
}

export default App;
