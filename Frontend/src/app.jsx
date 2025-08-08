// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import Login from './Login';
import Menu from './Menu';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router basename="/nfreg3">
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
    </Router>
  );
}

export default App;
