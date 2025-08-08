//src/Brukere.jsx

/*
08.08.2025 - Opprettet
*/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Brukere() {
  const [brukere, setBrukere] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hentBrukere = async () => {
      try {
        const res = await fetch('https://nfreg3.vercel.app/api/getUsers'); 
        if (!res.ok) throw new Error('Feil ved henting');
        const data = await res.json();
        setBrukere(data);
      } catch (err) {
        setError('Klarte ikke hente brukere');
      }
    };

    hentBrukere();
  }, []);

  return (
    <div className="aksjoner-container">
      <h2>Brukere</h2>

      <button className="main-button" onClick={() => navigate('/menu')}>
        Tilbake til meny
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="aksjonstabell" border="1">
        <thead>
            <tr>
            <th>Bruker</th>
            <th>E-post</th>
            <th>Rediger</th>
            </tr>
        </thead>
        <tbody>
            {aksjoner.map((a, index) => (
            <tr key={index}>
                <td>
                <div style={{ fontWeight: 'bold' }}>{a.s_name}</div>
                </td>
                <td>{a.s_email}</td>
                <td>
                <button
                    className="admin-button"
                    onClick={() => alert(`Rediger ${a.s_email}`)}
                >
                    Rediger
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
}

export default Aksjoner;
