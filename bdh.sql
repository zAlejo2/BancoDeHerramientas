-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-07-2024 a las 22:18:59
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdh`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `documento` int(11) NOT NULL,
  `contrasena` varchar(45) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adminsesion`
--

CREATE TABLE `adminsesion` (
  `idsesion` int(11) NOT NULL,
  `administradores_documento` int(11) DEFAULT NULL,
  `login` datetime NOT NULL DEFAULT current_timestamp(),
  `logout` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consumos`
--

CREATE TABLE `consumos` (
  `idconsumo` int(11) NOT NULL,
  `usuarios_documento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `danos`
--

CREATE TABLE `danos` (
  `iddano` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `observaciones` varchar(45) DEFAULT NULL,
  `elementos_idelemento` int(11) NOT NULL,
  `usuarios_documento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elementos`
--

CREATE TABLE `elementos` (
  `idelemento` int(11) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `disponibles` int(11) NOT NULL,
  `ubicacion` varchar(45) NOT NULL,
  `tipo` enum('prestamo','consumo') NOT NULL,
  `estado` enum('disponible','agotado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elementos_has_consumos`
--

CREATE TABLE `elementos_has_consumos` (
  `elementos_idelemento` int(11) NOT NULL,
  `consumos_idconsumo` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `observaciones` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elementos_has_encargos`
--

CREATE TABLE `elementos_has_encargos` (
  `elementos_idelemento` int(11) NOT NULL,
  `encargos_idencargo` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `observaciones` varchar(45) DEFAULT NULL,
  `fechaPedido` datetime NOT NULL DEFAULT current_timestamp(),
  `fechaReclamo` datetime NOT NULL,
  `estado` enum('pendiente','reclamado','finalizado','cancelado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elementos_has_prestamos`
--

CREATE TABLE `elementos_has_prestamos` (
  `elementos_idelemento` int(11) NOT NULL,
  `prestamos_idprestamo` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `observaciones` varchar(45) DEFAULT NULL,
  `estado` enum('actual','finalizado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encargos`
--

CREATE TABLE `encargos` (
  `idencargo` int(11) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `numero` varchar(45) NOT NULL,
  `usuarios_documento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `moras`
--

CREATE TABLE `moras` (
  `idmora` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `observaciones` varchar(45) DEFAULT NULL,
  `tiempoMora` time NOT NULL,
  `elementos_idelemento` int(11) NOT NULL,
  `usuarios_documento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `idprestamo` int(11) NOT NULL,
  `usuarios_documento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `idrol` int(11) NOT NULL,
  `descripcion` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `documento` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `contrasena` varchar(45) DEFAULT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `observaciones` varchar(45) DEFAULT NULL,
  `roles_idrol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`documento`);

--
-- Indices de la tabla `adminsesion`
--
ALTER TABLE `adminsesion`
  ADD PRIMARY KEY (`idsesion`),
  ADD KEY `documento` (`administradores_documento`);

--
-- Indices de la tabla `consumos`
--
ALTER TABLE `consumos`
  ADD PRIMARY KEY (`idconsumo`,`usuarios_documento`),
  ADD KEY `fk_consumos_usuarios1_idx` (`usuarios_documento`);

--
-- Indices de la tabla `danos`
--
ALTER TABLE `danos`
  ADD PRIMARY KEY (`iddano`,`elementos_idelemento`,`usuarios_documento`),
  ADD KEY `fk_danos_elementos1_idx` (`elementos_idelemento`),
  ADD KEY `fk_danos_usuarios1_idx` (`usuarios_documento`);

--
-- Indices de la tabla `elementos`
--
ALTER TABLE `elementos`
  ADD PRIMARY KEY (`idelemento`);

--
-- Indices de la tabla `elementos_has_consumos`
--
ALTER TABLE `elementos_has_consumos`
  ADD PRIMARY KEY (`elementos_idelemento`,`consumos_idconsumo`),
  ADD KEY `fk_elementos_has_consumos_consumos1_idx` (`consumos_idconsumo`),
  ADD KEY `fk_elementos_has_consumos_elementos1_idx` (`elementos_idelemento`);

--
-- Indices de la tabla `elementos_has_encargos`
--
ALTER TABLE `elementos_has_encargos`
  ADD PRIMARY KEY (`elementos_idelemento`,`encargos_idencargo`),
  ADD KEY `fk_elementos_has_encargos_encargos1_idx` (`encargos_idencargo`),
  ADD KEY `fk_elementos_has_encargos_elementos1_idx` (`elementos_idelemento`);

--
-- Indices de la tabla `elementos_has_prestamos`
--
ALTER TABLE `elementos_has_prestamos`
  ADD PRIMARY KEY (`elementos_idelemento`,`prestamos_idprestamo`),
  ADD KEY `fk_elementos_has_prestamos_prestamos1_idx` (`prestamos_idprestamo`),
  ADD KEY `fk_elementos_has_prestamos_elementos1_idx` (`elementos_idelemento`);

--
-- Indices de la tabla `encargos`
--
ALTER TABLE `encargos`
  ADD PRIMARY KEY (`idencargo`,`usuarios_documento`),
  ADD KEY `fk_encargos_usuarios1_idx` (`usuarios_documento`);

--
-- Indices de la tabla `moras`
--
ALTER TABLE `moras`
  ADD PRIMARY KEY (`idmora`,`elementos_idelemento`,`usuarios_documento`),
  ADD KEY `fk_moras_elementos1_idx` (`elementos_idelemento`),
  ADD KEY `fk_moras_usuarios1_idx` (`usuarios_documento`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`idprestamo`,`usuarios_documento`),
  ADD KEY `fk_prestamos_usuarios1_idx` (`usuarios_documento`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idrol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`documento`,`roles_idrol`),
  ADD KEY `fk_usuarios_roles1_idx` (`roles_idrol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adminsesion`
--
ALTER TABLE `adminsesion`
  MODIFY `idsesion` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adminsesion`
--
ALTER TABLE `adminsesion`
  ADD CONSTRAINT `adminsesion_ibfk_1` FOREIGN KEY (`administradores_documento`) REFERENCES `administradores` (`documento`);

--
-- Filtros para la tabla `consumos`
--
ALTER TABLE `consumos`
  ADD CONSTRAINT `fk_consumos_usuarios1` FOREIGN KEY (`usuarios_documento`) REFERENCES `usuarios` (`documento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `danos`
--
ALTER TABLE `danos`
  ADD CONSTRAINT `fk_danos_elementos1` FOREIGN KEY (`elementos_idelemento`) REFERENCES `elementos` (`idelemento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_danos_usuarios1` FOREIGN KEY (`usuarios_documento`) REFERENCES `usuarios` (`documento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `elementos_has_consumos`
--
ALTER TABLE `elementos_has_consumos`
  ADD CONSTRAINT `fk_elementos_has_consumos_consumos1` FOREIGN KEY (`consumos_idconsumo`) REFERENCES `consumos` (`idconsumo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_elementos_has_consumos_elementos1` FOREIGN KEY (`elementos_idelemento`) REFERENCES `elementos` (`idelemento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `elementos_has_encargos`
--
ALTER TABLE `elementos_has_encargos`
  ADD CONSTRAINT `fk_elementos_has_encargos_elementos1` FOREIGN KEY (`elementos_idelemento`) REFERENCES `elementos` (`idelemento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_elementos_has_encargos_encargos1` FOREIGN KEY (`encargos_idencargo`) REFERENCES `encargos` (`idencargo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `elementos_has_prestamos`
--
ALTER TABLE `elementos_has_prestamos`
  ADD CONSTRAINT `fk_elementos_has_prestamos_elementos1` FOREIGN KEY (`elementos_idelemento`) REFERENCES `elementos` (`idelemento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_elementos_has_prestamos_prestamos1` FOREIGN KEY (`prestamos_idprestamo`) REFERENCES `prestamos` (`idprestamo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `encargos`
--
ALTER TABLE `encargos`
  ADD CONSTRAINT `fk_encargos_usuarios1` FOREIGN KEY (`usuarios_documento`) REFERENCES `usuarios` (`documento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `moras`
--
ALTER TABLE `moras`
  ADD CONSTRAINT `fk_moras_elementos1` FOREIGN KEY (`elementos_idelemento`) REFERENCES `elementos` (`idelemento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_moras_usuarios1` FOREIGN KEY (`usuarios_documento`) REFERENCES `usuarios` (`documento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `fk_prestamos_usuarios1` FOREIGN KEY (`usuarios_documento`) REFERENCES `usuarios` (`documento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles1` FOREIGN KEY (`roles_idrol`) REFERENCES `roles` (`idrol`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
