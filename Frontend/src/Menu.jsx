// src/Menu.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css'; // Se CSS lenger ned

function Menu() {
  const [bruker, setBruker] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const visOmInfo = () => {  const versjon = process.env.REACT_APP_VERSION || 'ukjent';  alert(`NF Reg versjon ${versjon}`);};


  useEffect(() => {
    const data = sessionStorage.getItem('bruker');
    if (data) {
      setBruker(JSON.parse(data));
    } else {
      navigate('/'); // Send til login hvis ikke innlogget
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="menu-container">
      <header className="topbar">
        <div className="logo">NF Follo</div>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
        {menuOpen && (
          <div className="side-menu">
            <button onClick={() => alert('Mine innstillinger')}>Mine innstillinger</button>
            <button onClick={() => alert('Endre passord')}>Endre passord</button>
            <button onClick={visOmInfo}>Om NF Reg</button>
            <button onClick={handleLogout}>Logg ut</button>
          </div>
        )}
      </header>

      <main className="main-menu">
        <h2>Velkommen, {bruker?.name}</h2>

        <button className="main-button" onClick={() => alert('Register aksjon')}>
          Register aksjon
        </button>
        <button className="main-button" onClick={() => alert('Tidligere registreringer')}>
          Se mine tidligere registreringer
        </button>
        <button className="main-button" onClick={() => alert('Siste 5 aksjoner')}>
          Siste 5 aksjoner
        </button>

          {bruker?.userlevel >= 2 && (
            <div className="admin-section">
              <h3>Admin</h3>
              <button className="admin-button" onClick={() => navigate('/brukere')}>
                Se brukere
              </button>
              <button className="admin-button" onClick={() => alert('Legg til bruker')}>
                Legg til bruker
              </button>
              <button className="admin-button" onClick={() => navigate('/aksjoner')}>
                Se aksjoner
              </button>
              <button className="admin-button" onClick={() => alert('Legg til aksjon')}>
                Legg til aksjon
              </button>
              <button className="admin-button" onClick={() => alert('Se utstyr')}>
                Se utstyr
              </button>
            </div>
        )}
      </main>
    </div>
  );
}

export default Menu;
