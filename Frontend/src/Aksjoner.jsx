//src/Aksjoner.jsc

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

function Aksjoner() {
  const [aksjoner, setAksjoner] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hentAksjoner = async () => {
      try {
        const res = await fetch('https://nfreg3.vercel.app/api/hentAksjoner'); 
        if (!res.ok) throw new Error('Feil ved henting');
        const data = await res.json();
        setAksjoner(data);
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
            <th>Rediger</th>
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
                <button
                    className="admin-button"
                    onClick={() => alert(`Rediger ${a.s_code}`)}
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
