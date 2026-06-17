import { serve } from '@hono/node-server';
import { app } from './app';

const port = 3000;

console.log(`API running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
