import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { StreamChat } from 'stream-chat';

const app = express();
app.use(cors());
app.use(express.json());

const key = process.env.STREAM_KEY;
const secret = process.env.STREAM_SECRET;
const serverClient = StreamChat.getInstance(key, secret);

app.get('/health', (_, res) => res.json({ ok: true }));

// Issue a dev token for any userId you pass
app.post('/token', async (req, res) => {
  const { user_id } = req.body || {};
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  const token = serverClient.createToken(user_id);
  // Ensure the user exists/upserts basic profile
  await serverClient.upsertUser({ id: user_id, name: user_id });
  res.json({ token, user: { id: user_id, name: user_id }, api_key: key });
});

// Seed some demo users to pick when creating groups
app.post('/seed', async (_req, res) => {
  const users = [
    { id: 'joel', name: 'Joel' },
    { id: 'temi', name: 'Temi' },
    { id: 'dami', name: 'Dami' },
    { id: 'tobi', name: 'Tobi' },
    { id: 'zainab', name: 'Zainab' }
  ];
  await serverClient.upsertUsers(users);
  res.json({ seeded: users.map(u => u.id) });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Token server on http://localhost:${port}`);
});
