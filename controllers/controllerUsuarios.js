const UserModel = require('../models/modelUsuario');
const jwt = require('jsonwebtoken');

const registrarUsuarioController = (req, res) => {
  const { username, email, contrasena, confirmarContrasena } = req.body;
  console.log(req.body)
  if (!username || !email || !contrasena || !confirmarContrasena || !apodo) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios o las contraseñas no coinciden.' });
  }

  if (contrasena !== confirmarContrasena) {
    return res.status(400).json({ mensaje: 'Las contraseñas no coinciden.' });
  }

  // Verificar si el email es válido
  if (!validarEmail(email)) {
    return res.status(400).json({ mensaje: 'Email no válido.' });
  }

  // // Validar la contraseña
  // if (!validarContrasena(contrasena)) {
  //   return res.status(400).json({
  //     mensaje: 'La contraseña debe contener al menos una mayúscula, un número, un carácter especial y tener una longitud mínima de 7 caracteres.',
  //   });
  // }

  // Consultar existencia de apodo y email en la base de datos
  // UserModel.consultarExistenciaApodoEmail(apodo, email, (errorConsulta, counts) => {
  //   if (errorConsulta) {
  //     console.error('Error al consultar existencia de apodo y email:', errorConsulta);
  //     return res.status(500).json({ mensaje: 'Error al crear usuario' });
  //   }

  //   if (counts.apodoCount > 0 && counts.emailCount > 0) {
  //     return res.status(400).json({ mensaje: 'El apodo y el email ya existen' });
  //   }

  //   if (counts.apodoCount > 0) {
  //     return res.status(400).json({ mensaje: 'El apodo ya está en uso' });
  //   }

  //   if (counts.emailCount > 0) {
  //     return res.status(400).json({ mensaje: 'El email ya está registrado' });
  //   }

  //   // Obtener el nombre del archivo de la propiedad req.file
  //   const imagenUsuario = req.file ? req.file.filename : null;

  //   console.log('req.body:', req.body);
  //   console.log('req.file:', req.file);
  //   // Si todo está bien, llamar al modelo para insertar el usuario
    
  // });
  UserModel.registrarUsuario(nombre, email, contrasena, apodo, imagenUsuario, (errorRegistro, mensaje) => {
    if (errorRegistro) {
      console.error('Error en el controlador:', errorRegistro);
      res.status(500).json({ mensaje: errorRegistro });
    } else {
      res.status(201).json({ mensaje });
    }
  });
};
const obtenerInformacionUsuarioController = (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }

  UserModel.obtenerInformacionUsuario(userId, (error, usuario) => {
    if (error) {
      console.error('Error en el controlador al obtener información del usuario:', error);
      res.status(500).json({ mensaje: error });
    } else {
      res.status(200).json(usuario);
    }
  });
};



const validarEmail = (email) => {
  // Expresión regular para validar un email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Expresión regular para validar el dominio "@gmail.com" o "@gmail.es"
  const dominioGmailRegex = /@gmail\.(com|es)$/;

  return emailRegex.test(email) && dominioGmailRegex.test(email);
};
const validarContrasena = (contrasena) => {
  // Expresión regular para validar la contraseña
  const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,]).{7,}$/;


  console.log('Contraseña:', contrasena);
  console.log('Coincide con la expresión regular:', contrasenaRegex.test(contrasena));

  return contrasenaRegex.test(contrasena);
};

const iniciarSesion = (req, res) => {
 console.log('pedo')
  const { email, contrasena } = req.body;
  //const token = generateToken(req.user);
        if (req.user) {
          const token = jwt.sign({userId: req.user.id}, 'SECRET', {expiresIn: "24h"});
          console.log(token)
          //res.cookie('token', token, {
            // httpOnly: true
           //});
           return res.status(200).json({ token, mensaje: 'Inicio de sesión exitoso', userId: req.user.id });
        } else {
          return res.status(401).json({ mensaje: req.info.message});
        }

        
};


const agregarRecetaFavorita = (req, res) => {
  const { usuarioId, recetaId } = req.params; // Suponiendo que los IDs de usuario y receta se pasan en los parámetros de la URL
  
  UserModel.agregarRecetaFavorita(
    usuarioId, recetaId, (error, mensaje) => {
    if (error) {
      console.error('Error al agregar receta a favoritos:', error);
      res.status(500).json({ mensaje: error });
    } else {
      res.status(201).json({ mensaje });
    }
  });
};
const obtenerRutaImagenUsuarioController = (req, res) => {
  const userId = req.session.userId; // Obtén el ID del usuario desde la sesión

  if (!userId) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }

  // Llama a la función para obtener la ruta de la imagen del usuario
  UserModel.obtenerRutaImagenUsuario(userId, (error, rutaImagen) => {
    if (error) {
      console.error('Error al obtener la ruta de la imagen del usuario:', error);
      res.status(500).json({ mensaje: error });
    } else {
      res.status(200).json({ rutaImagen });
    }
  });
};
const obtenerRecetasFavoritas = (req, res) => {
  const usuarioId = req.session.userId; // Obtén el ID del usuario desde la sesión
  console.log(usuarioId)
  if (!usuarioId) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }
  console.log(`Obteniendo recetas favoritas para el usuario ID: ${usuarioId}`);

  UserModel.obtenerRecetasFavoritas(usuarioId, (error, recetas) => {
    if (error) {
      console.error('Error al obtener recetas favoritas:', error);
      res.status(500).json({ mensaje: error });
    } else {
      console.log('Recetas obtenidas:', recetas);
      res.status(200).json(recetas);
    }
  });
};

const obtenerRecetaFavorita = (req, res) => {
  const { usuarioId, recetaId } = req.params; 

  UserModel.obtenerRecetaFavorita(usuarioId, recetaId, (error, receta) => {
    if (error) {
      return res.status(500).json({ error });
    }
    if (typeof receta === 'string') {
      return res.status(404).json({ message: receta });
    }
    res.status(200).json({ receta });
  });
};

const calcularCaloriasUsuarioRegistrado = (req, res) => {
  console.log('Entro en calcularCaloriasUsuarioRegistrado'); // Agrega este registro
  console.log('req.user:', req.user); // Agrega este registro
  const usuarioId = req.user.id; // Obtiene el ID del usuario registrado
  console.log('usuarioId:', usuarioId); // Agrega este registro
  const datosCalculadora = req.body; // Datos de la calculadora enviados por el cliente
  console.log('datosCalculadora:', datosCalculadora); // 
  // Realiza el cálculo de calorías
  const caloriasRecomendadas = CalculadoraCaloriasModel.guardarCalculadoraCalorias(datosCalculadora);

  // Guarda los datos en la tabla calculadora_calorias
  CalculadoraCaloriasModel.guardarCalculadoraCalorias(datosCalculadora).then((calculadoraCaloriasId) => {
      // Guarda los datos en la tabla calorias_usuario
      return CaloriasUsuarioModel.guardarCaloriasUsuario(usuarioId, calculadoraCaloriasId, caloriasRecomendadas);
    })
    .then(() => {
      res.json({ message: 'Datos guardados correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error en el servidor' });
    });
};

module.exports = {
  iniciarSesion,
  registrarUsuarioController,
  obtenerInformacionUsuarioController,
  obtenerRecetasFavoritas,
  agregarRecetaFavorita,
  obtenerRecetaFavorita,calcularCaloriasUsuarioRegistrado,
  obtenerRutaImagenUsuarioController
};
