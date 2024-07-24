import Administrador from './administradorModel.js';
import AdminSesion from './adminsesionModel.js';
import Cliente from './clienteModel.js';
import Rol from './rolModel.js';
import Area from './areaModel.js';
import Elemento from './elementoModel.js';
import PrestamoCorriente from './prestamocorrienteModel.js';
import Mora from './moraModel.js';
import Dano from './danoModel.js';
import Consumo from './consumoModel.js';
import Encargo from './encargoModel.js';
import ElementoHasPrestamoCorriente from './elementoHasPrestamocorrienteModel.js';
import ElementoHasConsumo from './elementoHasConsumoModel.js';
import ElementoHasEncargo from './elementoHasEncargoModel.js';

// Definición de relaciones

// Un administrador puede tener muchas sesiones
Administrador.hasMany(AdminSesion, { 
    foreignKey: 'administradores_documento',
    as: 'sesiones' 
});

// Una sesión puede tener un administrador
AdminSesion.belongsTo(Administrador, { 
    foreignKey: 'administradores_documento',
    as: 'administrador'
});

// Un Elemento pertenece a un Area
Elemento.belongsTo(Area, {
    foreignKey: 'areas_idarea',
    as: 'area'
});

// Un Area puede tener muchos Elementos
Area.hasMany(Elemento, {
    foreignKey: 'areas_idarea',
    as: 'elementos'
});

// Un Administrador pertenece a un Area
Administrador.belongsTo(Area, {
    foreignKey: 'areas_idarea',
    as: 'area'
});

// Un Area puede tener muchos Administradores
Area.hasMany(Administrador, {
    foreignKey: 'areas_idarea',
    as: 'administradores'
});

// Un Cliente pertenece a un Rol
Cliente.belongsTo(Rol, {
    foreignKey: 'roles_idrol',
    as: 'rol'
});

// Un Rol puede tener muchos Clientes
Rol.hasMany(Cliente, {
    foreignKey: 'roles_idrol',
    as: 'clientes'
});

// Un Cliente puede tener muchos PrestamosCorrientes
Cliente.hasMany(PrestamoCorriente, {
    foreignKey: 'clientes_documento',
    as: 'prestamos'
});

// Un PrestamoCorriente pertenece a un Cliente
PrestamoCorriente.belongsTo(Cliente, {
    foreignKey: 'clientes_documento',
    as: 'cliente'
});

// Un Cliente puede tener muchas Moras
Cliente.hasMany(Mora, {
    foreignKey: 'clientes_documento',
    as: 'moras'
});

// Una Mora pertenece a un Cliente
Mora.belongsTo(Cliente, {
    foreignKey: 'clientes_documento',
    as: 'cliente'
});

// Un Cliente puede tener muchos Danos
Cliente.hasMany(Dano, {
    foreignKey: 'clientes_documento',
    as: 'danos'
});

// Un Dano pertenece a un Cliente
Dano.belongsTo(Cliente, {
    foreignKey: 'clientes_documento',
    as: 'cliente'
});

// Un Cliente puede tener muchos Consumos
Cliente.hasMany(Consumo, {
    foreignKey: 'clientes_documento',
    as: 'consumos'
});

// Un Consumo pertenece a un Cliente
Consumo.belongsTo(Cliente, {
    foreignKey: 'clientes_documento',
    as: 'cliente'
});

// Un Cliente puede tener muchos Encargos
Cliente.hasMany(Encargo, {
    foreignKey: 'clientes_documento',
    as: 'encargos'
});

// Un Encargo pertenece a un Cliente
Encargo.belongsTo(Cliente, {
    foreignKey: 'clientes_documento',
    as: 'cliente'
});

// Un PrestamoCorrriente puede tener muchos Elementos
PrestamoCorriente.belongsToMany(Elemento, {
    through: ElementoHasPrestamoCorriente,
    foreignKey: 'prestamos_idprestamo',
    as: 'elementos'
});

// Un Elemento puede estar en muchos PrestamosCorrientes
Elemento.belongsToMany(PrestamoCorriente, {
    through: ElementoHasPrestamoCorriente,
    foreignKey: 'elementos_idelemento',
    as: 'prestamos'
});

// Un Consumo puede tener muchos Elementos
Consumo.belongsToMany(Elemento, {
    through: ElementoHasConsumo,
    foreignKey: 'consumos_idconsumo',
    as: 'elementos'
});

// Un Elemento puede estar en muchos Consumos
Elemento.belongsToMany(Consumo, {
    through: ElementoHasConsumo,
    foreignKey: 'elementos_idelemento',
    as: 'consumos'
});

// Un Encargo puede tener muchos Elementos
Encargo.belongsToMany(Elemento, {
    through: ElementoHasEncargo,
    foreignKey: 'encargos_idencargo',
    as: 'elementos'
});

// Un Elemento puede estar en muchos Encargos
Elemento.belongsToMany(Encargo, {
    through: ElementoHasEncargo,
    foreignKey: 'elementos_idelemento',
    as: 'encargos'
});

// Un Elemento puede tener muchos Danos
Elemento.hasMany(Dano, { 
    foreignKey: 'elementos_idelemento',
    as: 'danos'
});

// Un Daño pertenece a un Elemento
Dano.belongsTo(Elemento, { 
    foreignKey: 'elementos_idelemento',
    as: 'elemento'
});

// Un Elemento puede tener muchas Moras
Elemento.hasMany(Mora, { 
    foreignKey: 'elementos_idelemento',
    as: 'moras' 
});

// Una mora pertenece a un Elemento 
Mora.belongsTo(Elemento, { 
    foreignKey: 'elementos_idelemento',
    as: 'elemento' 
});

export {
    Area,
    Administrador,
    AdminSesion,
    Cliente,
    Rol,
    Elemento,
    PrestamoCorriente,
    Mora,
    Dano,
    Consumo,
    Encargo,
    ElementoHasPrestamoCorriente,
    ElementoHasConsumo,
    ElementoHasEncargo
};
