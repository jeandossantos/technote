import { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const routes = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

routes.get('^/$|index(.html)?', (req, res) => {
  return res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

export { routes as rootRoutes };
