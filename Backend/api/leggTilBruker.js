// /api/leggTilBruker.js

/*
09.08.2025 - Oppdatere til serverless MySQL
*/

import bcrypt from 'bcrypt';
import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

export default async function handler(req, res) {
  // CORS headere
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Svar på preflight **før alt annet**
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { s_name, s_email, s_pwd, s_regno, i_userlevel, b_active } = req.body;

    if (!s_name || !s_email || !s_pwd) {
      return res.status(400).json({ success: false, message: 'Mangler nødvendige felter' });
    }

    const hashedPwd = await bcrypt.hash(s_pwd, 10);
    const dt_modify = new Date();

    await db.query(
      `INSERT INTO b_users (s_name, s_email, s_pwd, s_regno, i_userlevel, b_active, dt_modify)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [s_name, s_email, hashedPwd, s_regno || null, i_userlevel || 1, b_active || 1, dt_modify]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Feil i leggTilBruker:', err);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    await db.end();
  }
}