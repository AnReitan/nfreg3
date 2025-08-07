//src/login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    // For demo: godtar brukernavn 'test' og passord 'admin'
    if (email === 'test' && password === 'admin') {
      sessionStorage.setItem('bruker', JSON.stringify({ email }));
      navigate('/menu');
    } else {
      setError('Feil brukernavn eller passord');
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
