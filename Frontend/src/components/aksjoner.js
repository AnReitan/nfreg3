// src/components/Aksjoner.js
import React, { useEffect, useState } from 'react';

const Aksjoner = () => {
  const [aksjoner, setAksjoner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hentData = async () => {
      try {
        const res = await fetch('https://nfreg3.vercel.app/api/hentAksjoner');
        if (!res.ok) throw new Error(`HTTP-feil: ${res.status}`);
        const data = await res.json();
        setAksjoner(data);
      } catch (err) {
        setError(err.message || 'Noe gikk galt');
      } finally {
        setLoading(false);
      }
    };

    hentData();
  }, []);

  if (loading) return <p>Laster data...</p>;
  if (error) return <p>Feil: {error}</p>;

  return (
    <div>
      <h2>Liste over aksjoner</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Beskrivelse</th>
            <th>Objekt</th>
            <th>Fra-dato</th>
            <th>Til-dato</th>
          </tr>
        </thead>
        <tbody>
          {aksjoner.map((rad, index) => (
            <tr key={index}>
              <td>{rad.s_code}</td>
              <td>{rad.s_description}</td>
              <td>{rad.s_object}</td>
              <td>{rad.dt_date_from}</td>
              <td>{rad.dt_date_to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Aksjoner;
