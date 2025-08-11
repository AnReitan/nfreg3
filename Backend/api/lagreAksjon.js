/*
Lagrer aksjon i tr_innsats og eventuelt i tr_utstyr
*/
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://anreitan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Manglende eller ugyldig token' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verifiser token og hent userId (p_key fra d_user)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const r_user = decoded.userId;

    const b = req.body;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // tr_innsats – nå med r_user
    const [innsats] = await connection.execute(
      `INSERT INTO tr_innsats
      (r_user, r_aksjon, dt_from, dt_to, b_food, s_regno, i_km, i_pass, s_namePass, i_kmPass, b_payout, s_comment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r_user,
        b.r_aksjon, b.dt_from, b.dt_to, b.b_food ? 1 : 0, b.s_regno,
        b.i_km || 0, b.i_pass || 0, b.s_namePass || null, b.i_kmPass || 0,
        b.b_payout ? 1 : 0, b.s_comment || null
      ]
    );

    const innsatsId = innsats.insertId;

    // Funksjon for å legge inn utstyr
    const utstyrInsert = async (r_utstyr, km, hours) => {
      if (!r_utstyr) return;
      await connection.execute(
        `INSERT INTO tr_utstyr (r_innsats, dt_from, dt_to, r_utstyr, i_km, i_hours)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [innsatsId, b.dt_from, b.dt_to, r_utstyr, km || 0, hours || 0]
      );
    };

    await utstyrInsert(b.lagsbil, b.lagsbil_km, null);
    await utstyrInsert(b.terreng, null, b.terreng_hours);
    await utstyrInsert(b.drone, null, b.drone_hours);

    await connection.end();
    res.status(200).json({ success: true, id: innsatsId });
  } catch (error) {
    console.error('Auth/DB feil:', error);
    res.status(401).json({ success: false, error: 'Ugyldig token eller DB-feil' });
  }
}
