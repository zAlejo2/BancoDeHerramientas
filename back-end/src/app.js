import express from 'express';
import config from './config/config.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import areaRoutes from './routes/areaRouter.js';
import adminRoutes from './routes/administradorRouter.js';
import clientRoutes from './routes/clienteRouter.js';
import roleRoutes from './routes/rolRouter.js';
import elementRoutes from './routes/elementoRouter.js';
import sequelize from './db/connection.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/areas', areaRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/clients', clientRoutes); 
app.use('/api/roles', roleRoutes); 
app.use('/api/elements',elementRoutes);

// Configurar la carpeta 'uploads' como estática
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Sincronización de modelos con la base de datos
sequelize.sync()
  .then(() => console.log('Modelos sincronizados con la base de datos'))
  .catch((error) => console.error('Error syncing models:', error));

// configuración
app.set('port', config.app.port);

export default app;

