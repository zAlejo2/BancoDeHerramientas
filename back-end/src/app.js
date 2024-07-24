import express from 'express';
import config from './config/config.js';
import cors from 'cors';
// import path from 'path';

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
app.use('/api/admins', adminRoutes);
app.use('/api/users', clientRoutes); 
app.use('/api/roles', roleRoutes); 
app.use('/api/elements',elementRoutes);

// Sincronización de modelos con la base de datos
sequelize.sync()
  .then(() => console.log('Modelos sincronizados con la base de datos'))
  .catch((error) => console.error('Error syncing models:', error));

// configuración
app.set('port', config.app.port);

export default app;

