// api/endrePassord.js

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS (endre til ditt domene)
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

console.log('Request body:', req.body);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST er tillatt' });
  }

  // Hent token fra Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Mangler eller ugyldig autorisering' });
  }
  const token = authHeader.split(' ')[1];

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Ugyldig eller utløpt token' });
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Nytt passord må være minst 6 tegn' });
  }

  try {
    // Hash det nye passordet
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Oppdater passord i DB for bruker med id fra token
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [result] = await connection.execute(
      'UPDATE d_user SET s_pwd = ? WHERE p_key = ?',
      [hashedPassword, payload.id]
    );

     await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bruker ikke funnet' });
    }

    return res.status(200).json({ success: true, message: 'Passord endret' });

  } catch (error) {
    console.error('Feil ved passordendring:', error);
    return res.status(500).json({ error: 'Serverfeil' });
  }
}