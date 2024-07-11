import sequelize from '../db/connection.js'; // Importa la conexión
import Administrador from './administradorModel.js';
import Usuario from './usuarioModel.js';
import Rol from './rolModel.js';
import Elemento from './elementoModel.js';
import Prestamo from './prestamoModel.js';
import Mora from './moraModel.js';
import Dano from './danoModel.js';
import Consumo from './consumoModel.js';
import Encargo from './encargoModel.js';
import ElementoHasPrestamo from './elementoHasPrestamoModel.js';
import ElementoHasConsumo from './elementoHasConsumoModel.js';
import ElementoHasEncargo from './elementoHasEncargoModel.js';

// Definición de relaciones

// Un Usuario pertenece a un Rol
Usuario.belongsTo(Rol, {
    foreignKey: 'roles_idrol',
    as: 'rol'
});

// Un Rol puede tener muchos Usuarios
Rol.hasMany(Usuario, {
    foreignKey: 'roles_idrol',
    as: 'usuarios'
});

// Un Usuario puede tener muchos Prestamos
Usuario.hasMany(Prestamo, {
    foreignKey: 'usuarios_documento',
    as: 'prestamos'
});

// Un Prestamo pertenece a un Usuario
Prestamo.belongsTo(Usuario, {
    foreignKey: 'usuarios_documento',
    as: 'usuario'
});

// Un Usuario puede tener muchas Moras
Usuario.hasMany(Mora, {
    foreignKey: 'usuarios_documento',
    as: 'moras'
});

// Una Mora pertenece a un Usuario
Mora.belongsTo(Usuario, {
    foreignKey: 'usuarios_documento',
    as: 'usuario'
});

// Un Usuario puede tener muchos Danos
Usuario.hasMany(Dano, {
    foreignKey: 'usuarios_documento',
    as: 'danos'
});

// Un Dano pertenece a un Usuario
Dano.belongsTo(Usuario, {
    foreignKey: 'usuarios_documento',
    as: 'usuario'
});

// Un Usuario puede tener muchos Consumos
Usuario.hasMany(Consumo, {
    foreignKey: 'usuarios_documento',
    as: 'consumos'
});

// Un Consumo pertenece a un Usuario
Consumo.belongsTo(Usuario, {
    foreignKey: 'usuarios_documento',
    as: 'usuario'
});

// Un Usuario puede tener muchos Encargos
Usuario.hasMany(Encargo, {
    foreignKey: 'usuarios_documento',
    as: 'encargos'
});

// Un Encargo pertenece a un Usuario
Encargo.belongsTo(Usuario, {
    foreignKey: 'usuarios_documento',
    as: 'usuario'
});

// Un Prestamo puede tener muchos Elementos
Prestamo.belongsToMany(Elemento, {
    through: ElementoHasPrestamo,
    foreignKey: 'prestamos_idprestamo',
    as: 'elementos'
});

// Un Elemento puede estar en muchos Prestamos
Elemento.belongsToMany(Prestamo, {
    through: ElementoHasPrestamo,
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

export {
    Administrador,
    Usuario,
    Rol,
    Elemento,
    Prestamo,
    Mora,
    Dano,
    Consumo,
    Encargo,
    ElementoHasPrestamo,
    ElementoHasConsumo,
    ElementoHasEncargo
};
