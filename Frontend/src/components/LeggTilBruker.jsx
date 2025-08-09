import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registrering.css';

function LeggTilBruker() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    s_name: '',
    s_email: '',
    s_pwd: '',
    s_regno: '',
    i_userlevel: 1,
    b_active: 1,
  });
  const [melding, setMelding] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://nfreg3.vercel.app/api/leggTilBruker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.success) {
      setMelding('Bruker opprettet!');
      setTimeout(() => navigate('/menu'), 1500);
    } else {
      setMelding('Feil ved opprettelse av bruker.');
    }
  };

  return (
    <div className="leggtil-container">
      <h2>Legg til ny bruker</h2>

      {melding && <p>{melding}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Navn:
          <input name="s_name" value={formData.s_name} onChange={handleChange} required />
        </label>
        <label>
          E-post:
          <input name="s_email" type="email" value={formData.s_email} onChange={handleChange} required />
        </label>
        <label>
          Passord:
          <input name="s_pwd" type="password" value={formData.s_pwd} onChange={handleChange} required />
        </label>
        <label>
          Registreringsnummer:
          <input name="s_regno" value={formData.s_regno} onChange={handleChange} />
        </label>
        <label>
          Brukernivå:
          <select name="i_userlevel" value={formData.i_userlevel} onChange={handleChange}>
            <option value={1}>Frivillig</option>
            <option value={2}>OPL</option>
            <option value={3}>Admin</option>
          </select>
        </label>
        <label>
          Aktiv:
          <select name="b_active" value={formData.b_active} onChange={handleChange}>
            <option value={1}>Aktiv</option>
            <option value={0}>Inaktiv</option>
          </select>
        </label>

        <button className="admin-button" type="submit">Lagre bruker</button>
        <button className="main-button" onClick={() => navigate('/menu')} type="button">Tilbake</button>
      </form>
    </div>
  );
}

export default LeggTilBruker;
