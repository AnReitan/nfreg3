// src/Menu.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

function Menu() {
  const [bruker, setBruker] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const visOmInfo = () => {
    const versjon = process.env.REACT_APP_VERSION || 'ukjent';
    alert(`NF Reg versjon ${versjon}`);
  };

  useEffect(() => {
    const data = sessionStorage.getItem('bruker');
    if (data) {
      setBruker(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handlePasswordChange = async () => {
    setMessage('');
    if (!newPassword) {
      setMessage('Vennligst fyll inn nytt passord');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('https://nfreg3.vercel.app/api/endrePassord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Passord endret!');
        setNewPassword('');
        setShowChangePassword(false);
      } else {
        setMessage(data.message || data.error || 'Feil ved endring av passord');
      }
    } catch (err) {
      setMessage('Noe gikk galt, prøv igjen senere');
    }
  };


  

  return (
    <div className="menu-container">
      <header className="topbar">
        <div className="logo">NF Follo</div>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
        {menuOpen && (
          <div className="side-menu">
            <button onClick={() => alert('Mine innstillinger')}>Mine innstillinger</button>
            <button onClick={() => {
              setShowChangePassword(true);
              setMenuOpen(false);
            }}>Endre passord</button>
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
        <button className="main-button" onClick={() => navigate('/sisteaksjoner')}>
          Siste 5 aksjoner
        </button>

        {bruker?.userlevel >= 2 && (
          <div className="admin-section">
            <h3>Admin</h3>
            <button className="admin-button" onClick={() => navigate('/brukere')}>
              Se brukere
            </button>
            <button className="admin-button" onClick={() => navigate('/leggtilbruker')}>
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

      {/* Popup modal for passordendring */}
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Endre passord</h3>
            <input
              type="password"
              placeholder="Nytt passord"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Lagre</button>
            <button onClick={() => setShowChangePassword(false)}>Avbryt</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
