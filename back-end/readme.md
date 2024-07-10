El back-end está desarrollado con node.js con el framework de express, tiene una estructura
de modelo-vista-controlador.

En la carpeta models se utiliza sequelize para definir los modelos de la base de datos
como objetos de js para mayor facilidad, cada archivo representa una tabla en la base de datos.
En el archivo index.js dentro de la carpeta models se definen las relaciones entre las tablas,
es necesario tener en cuenta que la conexión a la base de datos también se realizó utilizando
sequelize en la carpeta db en el archivo connection.js