import express from 'express';
import {config} from './config/config.js';

const app = express();

// middleware

// configuración
app.set('port', config.app.port);

// rutas


export {app};