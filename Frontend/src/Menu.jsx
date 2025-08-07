//src/menu.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();
  const [view, setView] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const bruker = JSON.parse(sessionStorage.getItem('bruker'));

  const hentBrukere = async () => {
    setError('');
    setView('brukere');
    try {
      // Her må du bytte ut URL med din backend-API
      const res = await fetch('https://nfreg3.vercel.app/api/getUsers');
      if (!res.ok) throw new Error('Feil ved henting');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('Feil ved henting av brukere');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bruker');
    navigate('/');
  };

  return (
    <div>
      <h2>Velkommen {bruker?.email}!</h2>

      <button onClick={hentBrukere}>Vis brukere</button>
      <button onClick={handleLogout}>Logg ut</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {view === 'brukere' && (
        <table border="1">
          <thead>
            <tr>
              <th>Navn</th>
              <th>E-post</th>
              <th>Reg.nr</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, i) => (
              <tr key={i}>
                <td>{u.s_name}</td>
                <td>{u.s_email}</td>
                <td>{u.s_regno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Menu;
