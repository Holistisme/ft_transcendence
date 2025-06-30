import { FastifyInstance } from 'fastify';
import { initDB } from '../db';

export async function userRoutes(server: FastifyInstance) {
  const db = await initDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      score INTEGER DEFAULT 0
    )
  `);

  server.get('/users', async () => {
    return await db.all('SELECT * FROM users');
  });

  server.post('/users', async (req, reply) => {
    const { username } = req.body as { username: string };
    try {
      await db.run('INSERT INTO users (username) VALUES (?)', username);
      reply.send({ status: 'ok' });
    } catch (e) {
      reply.status(400).send({ error: 'user exists or invalid' });
    }
  });
}
