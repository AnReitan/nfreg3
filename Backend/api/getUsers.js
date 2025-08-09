  // api/getUsers.js

  /*
  09.08.2025 - oppdatert med auth-token 
  */

  import mysql from 'mysql2/promise';
  import jwt from 'jsonwebtoken';

  export default async function handler(req, res) {
    // 🔓 Tillat CORS fra GitHub Pages
    res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Håndter preflight OPTIONS-request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Hent token fra Authorization-header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Manglende eller ugyldig token' });
      }

      const token = authHeader.split(' ')[1];


    try {
      // Verifiser token med hemmelighet (samme som ved signering)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });

      const [rows] = await connection.execute(
        'SELECT p_key, s_name, s_email, s_regno FROM d_user'
      );
      await connection.end();

      res.status(200).json(rows);

      } catch (error) {
          console.error('Auth feil eller DB error:', error);
          return res.status(401).json({ error: 'Ugyldig token' });
      }
  }