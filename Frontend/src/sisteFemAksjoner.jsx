//src/SisteFemAksjoner.jsc

/*
08.08.2025 - Opprettet
*/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function formatDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // måneder er 0-indeksert
  const year = String(date.getFullYear()).slice(-2); // kun de to siste sifrene
  return `${day}.${month}.${year}`;
}

function SisteAksjoner() {
  const [aksjoner, setAksjoner] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 useEffect(() => {
  const hentAksjoner = async () => {
    try {
      const res = await fetch('https://nfreg3.vercel.app/api/hentAksjoner'); 
      if (!res.ok) throw new Error('Feil ved henting');
      const data = await res.json();
      const sortert = data
        .sort((a, b) => new Date(b.dt_date_from) - new Date(a.dt_date_from)) // Sorter så nyeste kommer øverst
        .slice(0, 5); // Hent kun de 5 nyeste
setAksjoner(sortert);
    } catch (err) {
      setError('Klarte ikke hente aksjoner');
    }
  };

    hentAksjoner();
  }, []);

  return (
    <div className="aksjoner-container">
      <h2>Aksjoner</h2>

      <button className="main-button" onClick={() => navigate('/menu')}>
        Tilbake til meny
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="aksjonstabell" border="1">
        <thead>
            <tr>
            <th>Aksjon</th>
            <th>Utkalling</th>
            </tr>
        </thead>
        <tbody>
            {aksjoner.map((a, index) => (
            <tr key={index}>
                <td>
                <div style={{ fontWeight: 'bold' }}>{a.s_code}</div>
                <div>{a.s_description}</div>
                </td>
                <td>{formatDate(a.dt_date_from)}</td>
                <td>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
}

export default SisteAksjoner;
