import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
  });
});

const port = 3000;

console.log(`API running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});