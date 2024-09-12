import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './db/connection.js';
import config from './config/config.js';

import loginRoute from './routes/auth/loginRouter.js';
import logoutRoute from './routes/auth/logoutRouter.js';
import areaRoutes from './routes/areaRouter.js';
import historialRoute from './routes/historialRouter.js'
import adminRoutes from './routes/administradorRouter.js';
import clientRoutes from './routes/clienteRouter.js';
import roleRoutes from './routes/rolRouter.js';
import elementRoutes from './routes/elementoRouter.js';
import prestamoCorienteRoutes from './routes/prestamoCorrienteRouter.js';
import consumoRoutes from './routes/consumoRouter.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/login', loginRoute);
app.use('/api/logout', logoutRoute);
app.use('/api/historial', historialRoute);
app.use('/api/areas', areaRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/clients', clientRoutes); 
app.use('/api/roles', roleRoutes); 
app.use('/api/elements',elementRoutes);
app.use('/api/prestamos', prestamoCorienteRoutes);
app.use('/api/consumos', consumoRoutes);

// Configurar la carpeta 'uploads' como estática
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Confirmar conexión con la bd
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente con la base de datos');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}
checkConnection();

// Sincronización de modelos con la base de datos
sequelize.sync()
  .then(() => console.log('Modelos sincronizados con la base de datos'))
  .catch((error) => console.error('Error syncing models:', error));

// configuración 
app.set('port', config.app.port);

export default app;

