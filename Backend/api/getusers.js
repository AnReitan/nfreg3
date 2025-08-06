// api/getUsers.js

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // 🔓 Tillat CORS fra GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Håndter preflight OPTIONS-request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }


  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT s_name, s_email, s_regno FROM d_user');
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database error' });
  }
}
