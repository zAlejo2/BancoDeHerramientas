import express from 'express';
import config from './config/config.js';
import cors from 'cors';
// import path from 'path';

import adminRoutes from './routes/administradorRouter.js';
import userRoutes from './routes/usuarioRouter.js';
import roleRoutes from './routes/rolRouter.js';
import elementRoutes from './routes/elementoRouter.js';
import sequelize from './db/connection.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/admins', adminRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/roles', roleRoutes); 
app.use('/api/elements',elementRoutes);

// // Sirviendo archivos estáticos para admin
// app.use('/admin', express.static(path.join(__dirname, '../front-end/admin/build')));

// // Sirviendo archivos estáticos para usuario
// app.use('/user', express.static(path.join(__dirname, '../front-end/user/build')));

// // Catch-all para servir index.html de admin
// app.get('/admin/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front-end/admin/build/index.html'));
// });

// // Catch-all para servir index.html de usuario
// app.get('/user/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../front-end/user/build/index.html'));
// });

// Sincronización con la base de datos
sequelize.sync()
  .then(() => console.log('Models synchronized with database'))
  .catch((error) => console.error('Error syncing models:', error));

// configuración
app.set('port', config.app.port);

export default app;

