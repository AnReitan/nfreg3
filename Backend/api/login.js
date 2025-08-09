// api/login.js

/*
 08.08.2025 - lagt til brukerlevel som returdata
 09.08.2025 - Endret til JSON Webtoken
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS for GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Kun POST er tillatt' });
  }

  const { email, password } = req.body;

  try {
    console.log('🟡 Login request mottatt:', { email });

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT p_key, s_name, s_email, s_pwd, i_userlevel FROM d_user WHERE s_email = ?',
      [email]
    );

    await connection.end();

    if (rows.length === 0) {
      console.warn('🔴 Ingen bruker funnet');
      return res.status(401).json({ success: false, message: 'Feil brukernavn eller passord' });
    }

    const bruker = rows[0];
    console.log('🔍 Bruker hentet:', bruker);

    // 1. Sjekk om passordet er lagret i klartekst (kun for testing)
    if (password === bruker.s_pwd) {
      console.log('✅ Passord stemmer i klartekst!');
    } else {
      // 2. Ellers: sammenlign med hash
      let hash = bruker.s_pwd;
      if (hash.startsWith('$2y$')) {
        hash = '$2a$' + hash.slice(4);  // bcryptjs støtter ikke $2y$
      }
      const passordOK = await bcrypt.compare(password, hash);
      console.log('✅ bcrypt.compare resultat:', passordOK);

      if (!passordOK) {
        return res.status(401).json({ success: false, message: 'Feil brukernavn eller passord' });
      }
    }

    // Lag JWT-token
    const token = jwt.sign(
      {
        id: bruker.p_key,
        name: bruker.s_name,
        userlevel: bruker.i_userlevel,
        email: bruker.s_email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: bruker.p_key,
        name: bruker.s_name,
        userlevel: bruker.i_userlevel,
        email: bruker.s_email,
      },
    });
  } catch (error) {
    console.error('💥 Login-feil:', error);
    return res.status(500).json({ error: 'Databasefeil', details: error.message });
  }
}
