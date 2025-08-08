// src/Login.jsx
// 08.08.2025 - add userlevel in retunrdata

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    try {
      const response = await fetch('https://nfreg3.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Feil brukernavn eller passord');
        return;
      }

      // Vellykket innlogging
      sessionStorage.setItem('bruker', JSON.stringify({ email, name: data.name, userlevel: data.userlevel }));
      navigate('/menu');

    } catch (err) {
      console.error('Innloggingsfeil:', err);
      setError('Klarte ikke å logge inn. Prøv igjen senere.');
    }
  };

  return (
    <div>
      <h2>Logg inn</h2>
      <input
        type="email"
        placeholder="E-post"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Passord"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Logg inn</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;