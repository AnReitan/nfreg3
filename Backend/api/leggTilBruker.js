// /api/leggTilBruker.js

import bcrypt from 'bcrypt';
import pool from './db'; // din eksisterende DB-kobling

export default async function handler(req, res) {
  // Tillat CORS for GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight request – MÅ respondere 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { s_name, s_email, s_pwd, s_regno, i_userlevel, b_active } = req.body;

    const hashedPwd = await bcrypt.hash(s_pwd, 10);
    const dt_modify = new Date();

    const query = `
      INSERT INTO b_users 
      (s_name, s_email, s_pwd, s_regno, i_userlevel, b_active, dt_modify) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      s_name,
      s_email,
      hashedPwd,
      s_regno || null,
      i_userlevel || 1,
      b_active || 1,
      dt_modify,
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Feil i leggTilBruker:', err);
    return res.status(500).json({ success: false });
  }
}
