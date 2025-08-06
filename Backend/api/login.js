import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST er tillatt' });
  }

  const { email, password } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT s_name FROM d_user WHERE s_email = ? AND s_pwn = ?',
      [email, password]
    );

    await connection.end();

    if (rows.length > 0) {
      res.status(200).json({ success: true, name: rows[0].s_name });
    } else {
      res.status(401).json({ success: false, message: 'Feil brukernavn eller passord' });
    }
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Databasefeil' });
  }
}
