// /api/leggTilBruker.js

/*
09.08.2025 - Oppdatere til serverless MySQL. flytte Prefligh tidligere
*/

export default async function handler(req, res) {
  // CORS-headere for GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight (OPTIONS) → svar alltid 200 OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Kun POST er tillatt
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Dynamic import → last modulene kun når vi faktisk kjører POST
    const bcrypt = await import('bcryptjs');
    const mysqlModule = await import('serverless-mysql');
    const mysql = mysqlModule.default;

    // Sett opp DB-tilkobling
    const db = mysql({
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
    });

    // Hent data fra body
    const { s_name, s_email, s_pwd, s_regno, i_userlevel, b_active } = req.body;

    if (!s_name || !s_email || !s_pwd) {
      return res.status(400).json({
        success: false,
        message: 'Mangler nødvendige felter (s_name, s_email, s_pwd)',
      });
    }

    // Hash passordet
    const hashedPwd = await bcrypt.hash(s_pwd, 10);
    const dt_modify = new Date();

    // Kjør SQL-insert
    await db.query(
      `INSERT INTO d_user
        (s_name, s_email, s_pwd, s_regno, i_userlevel, b_active, dt_modify)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        s_name,
        s_email,
        hashedPwd,
        s_regno || null,
        i_userlevel || 1,
        b_active || 1,
        dt_modify,
      ]
    );

    // Lukk tilkoblingen
    await db.end();

    // Send OK-respons
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Feil i leggTilBruker:', err);
    return res.status(500).json({
      success: false,
      error: err.message, // Returner feilmeldingen fra DB eller kode
    });
  }
}
