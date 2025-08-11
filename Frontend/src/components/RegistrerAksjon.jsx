import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registrering.css';

function RegistrerAksjon() {
  const [aksjoner, setAksjoner] = useState([]);
  const [lagsbil, setLagsbil] = useState([]);
  const [terreng, setTerreng] = useState([]);
  const [droner, setDroner] = useState([]);
  const [bruker, setBruker] = useState({});
  const navigate = useNavigate();

  const [form, setForm] = useState({
    r_aksjon: '',
    dt_from: '',
    dt_to: '',
    b_food: false,
    b_personbil: false,
    s_regno: '',
    i_km: '',
    i_pass: '',
    s_namePass: '',
    i_kmPass: '',
    b_payout: false,
    lagsbil: '',
    lagsbil_km: '',
    terreng: '',
    terreng_hours: '',
    drone: '',
    drone_hours: '',
    s_comment: ''
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    Promise.all([
      fetch('https://nfreg3.vercel.app/api/getAktiveAksjoner', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('https://nfreg3.vercel.app/api/getUtstyr?type=1', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('https://nfreg3.vercel.app/api/getUtstyr?type=2', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('https://nfreg3.vercel.app/api/getUtstyr?type=3', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('https://nfreg3.vercel.app/api/getBrukerinfo', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ]).then(([aks, lag, ter, dro, bruk]) => {
      setAksjoner(aks);
      setLagsbil(lag);
      setTerreng(ter);
      setDroner(dro);
      setBruker(bruk);
      setForm(f => ({ ...f, s_regno: bruk.s_regno || '' }));
    });
  }, []);

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const res = await fetch('https://nfreg3.vercel.app/api/lagreAksjon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      alert('Aksjon lagret!');
      navigate('/');
    } else {
      alert('Feil: ' + data.error);
    }
  };

  return (
    <div className="leggtil-container">
      <h2>Registrer aksjon</h2>
      <form onSubmit={handleSubmit}>
        {/* 1 */}
        <label>
          Aksjon
          <select name="r_aksjon" value={form.r_aksjon} onChange={handleChange} required>
            <option value="">-- Velg --</option>
            {aksjoner.map(a => <option key={a.p_key} value={a.p_key}>{a.s_description}</option>)}
          </select>
        </label>

        {/* 2 */}
        <label>
          Dato/tid rykket
          <input type="datetime-local" name="dt_from" value={form.dt_from} onChange={handleChange} required />
        </label>

        {/* 3 */}
        <label>
          Dato/tid hjemme
          <input type="datetime-local" name="dt_to" value={form.dt_to} onChange={handleChange} required />
        </label>

        {/* 4 */}
        <label>
          <input type="checkbox" name="b_food" checked={form.b_food} onChange={handleChange} /> Fått mat?
        </label>

        {/* 5 */}
        <label>
          <input type="checkbox" name="b_personbil" checked={form.b_personbil} onChange={handleChange} /> Kjørt personbil?
        </label>

        {form.b_personbil && (
          <>
            {/* 6 */}
            <label>
              Registreringsnummer
              <input type="text" name="s_regno" value={form.s_regno} readOnly />
            </label>

            {/* 7 */}
            <label>
              Kilometer, privatbil
              <input type="number" name="i_km" value={form.i_km} onChange={handleChange} />
            </label>

            {/* 9 */}
            <label>
              Antall passasjerer i privatbil
              <input type="number" name="i_pass" value={form.i_pass} onChange={handleChange} />
            </label>

            {parseInt(form.i_pass) > 0 && (
              <>
                {/* 10 */}
                <label>
                  Navn, passasjerer
                  <input type="text" name="s_namePass" value={form.s_namePass} onChange={handleChange} />
                </label>

                {/* 11 */}
                <label>
                  Kilometer, passasjerer
                  <input type="number" name="i_kmPass" value={form.i_kmPass} onChange={handleChange} />
                </label>
              </>
            )}
          </>
        )}

        {/* 12 */}
        <label>
          <input type="checkbox" name="b_payout" checked={form.b_payout} onChange={handleChange} /> Skal kjøregodtgjørelse utbetales?
        </label>

        {/* 13 */}
        <label>
          Lagsbil
          <select name="lagsbil" value={form.lagsbil} onChange={handleChange}>
            <option value="">-- Velg --</option>
            {lagsbil.map(u => <option key={u.p_key} value={u.p_key}>{u.s_description}</option>)}
          </select>
        </label>

        {form.lagsbil && (
          <label>
            Kilometer, lagsbil
            <input type="number" name="lagsbil_km" value={form.lagsbil_km} onChange={handleChange} />
          </label>
        )}

        {/* 15 */}
        <label>
          Terrengkjøretøy
          <select name="terreng" value={form.terreng} onChange={handleChange}>
            <option value="">-- Velg --</option>
            {terreng.map(u => <option key={u.p_key} value={u.p_key}>{u.s_description}</option>)}
          </select>
        </label>

        {form.terreng && (
          <label>
            Timer, terrengkjøretøy
            <input type="number" name="terreng_hours" value={form.terreng_hours} onChange={handleChange} />
          </label>
        )}

        {/* 17 */}
        <label>
          Droner
          <select name="drone" value={form.drone} onChange={handleChange}>
            <option value="">-- Velg --</option>
            {droner.map(u => <option key={u.p_key} value={u.p_key}>{u.s_description}</option>)}
          </select>
        </label>

        {form.drone && (
          <label>
            Timer, drone
            <input type="number" name="drone_hours" value={form.drone_hours} onChange={handleChange} />
          </label>
        )}

        {/* 19 */}
        <label>
          Kommentar / TS
          <input type="text" name="s_comment" value={form.s_comment} onChange={handleChange} />
        </label>

        <button type="submit" className="main-button">Lagre</button>
      </form>
    </div>
  );
}

export default RegistrerAksjon;
