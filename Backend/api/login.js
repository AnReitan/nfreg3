import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // CORS headers for GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST er tillatt' });
  }

  const { email, password } = req.body;

  try {
    console.log('🟡 Mottatt login request:', { email, password });

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT s_name, s_pwd FROM d_user WHERE s_email = ?',
      [email]
    );

    await connection.end();

    console.log('🟢 Bruker funnet i databasen:', rows);

    if (rows.length === 0) {
      console.warn('🔴 Fant ingen bruker med den e-posten.');
      return res.status(401).json({ success: false, message: 'Feil brukernavn eller passord' });
    }

    const bruker = rows[0];

    console.log('🔍 Sammenligner passord med hash:', bruker.s_pwd);
    const passordOK = await bcrypt.compare(password, bruker.s_pwd);
    console.log('✅ Passord riktig?', passordOK);

    if (!passordOK) {
      return res.status(401).json({ success: false, message: 'Feil brukernavn ELLER passord' });
    }

    return res.status(200).json({ success: true, name: bruker.s_name });

  } catch (error) {
    console.error('💥 Feil i login-handler:', error);
    return res.status(500).json({ error: 'Databasefeil', details: error.message });
  }
}
