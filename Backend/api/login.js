import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // CORS for GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST er tillatt' });
  }

  const { email, password } = req.body;

  try {
    console.log('🟡 Login request mottatt:', { email });

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

    if (rows.length === 0) {
      console.warn('🔴 Ingen bruker funnet');
      return res.status(401).json({ success: false, message: 'Feil brukernavn eller passord' });
    }

    const bruker = rows[0];
    console.log('🔍 Bruker hentet:', bruker);

    // 1. Sjekk om passordet er lagret i klartekst (f.eks. for testing)
    if (password === bruker.s_pwd) {
      console.log('✅ Passord stemmer i klartekst!');
      return res.status(200).json({ success: true, name: bruker.s_name });
    }

    // 2. Ellers: sammenlign med hash
    let hash = bruker.s_pwd;
    if (hash.startsWith('$2y$')) {
      hash = '$2a$' + hash.slice(4);  // bcryptjs støtter ikke $2y$
    }

    const passordOK = await bcrypt.compare(password, hash);
    console.log('✅ bcrypt.compare resultat:', passordOK);

    if (!passordOK) {
      return res.status(401).json({ success: false, message: 'Feil brukernavn eller passord' });
    }

    return res.status(200).json({ success: true, name: bruker.s_name });

  } catch (error) {
    console.error('💥 Login-feil:', error);
    return res.status(500).json({ error: 'Databasefeil', details: error.message });
  }
}