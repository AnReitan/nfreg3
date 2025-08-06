// App.jsx

import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/getUsers')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div>
      <h1>Brukere</h1>
      <table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>E-post</th>
            <th>Reg.nr</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td>{user.s_name}</td>
              <td>{user.s_email}</td>
              <td>{user.s_regno}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
