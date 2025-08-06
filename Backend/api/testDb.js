// api/testDb.js

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    // Logg miljøvariabler (valgfritt for feilsøking – fjern i produksjon)
    console.log('DB_HOST:', process.env.DB_HOST);

    // Opprett tilkobling
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Kjør enkel testspørring
    const [rows] = await connection.query('SELECT 1 + 1 AS result');

    await connection.end();

    // Send testresultatet
    res.status(200).json({
      message: 'Tilkobling OK!',
      db_result: rows[0].result, // Bør være 2
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Feil ved databaseforbindelse', details: error.message });
  }
}