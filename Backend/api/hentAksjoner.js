// api/hentAksjoner.js

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT s_code FROM d_aksjon');
    await connection.end();

    res.status(200).json(rows);
  } 
catch (error) {
  console.error('DB error:', error);
  res.status(500).json({
    error: 'Database error',
    message: error.message,
    sqlMessage: error.sqlMessage,
    code: error.code,
  });
}

}
