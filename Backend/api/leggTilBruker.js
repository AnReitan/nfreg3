import bcrypt from 'bcrypt';
import pool from './db'; // bruk din eksisterende db-forbindelse

export default async function handler(req, res) {
  // Tillat kun POST
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // legg til header her også for selve POST-kallet
    res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');

    // Din eksisterende kode
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
  } catch (error) {
    console.error('Feil ved opprettelse:', error);
    return res.status(500).json({ success: false });
  }
}