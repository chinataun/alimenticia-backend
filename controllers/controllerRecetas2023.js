const { Receta, Ingrediente, obtenerTodasLasRecetas,Categoria,RecetaModel,searchRecetas,UnidadMedida,Paso ,Voto,Dificultad} = require('../models/recetasModel2023');
const { configurarMulter } = require('../configuracion/configuracionMulter');
const upload = configurarMulter('backend/public');
const path = require('path');

async function crearRecetaConIngredientes(req, res) {
  try {
    const { titulo, descripcion, supermercado,id_categoria,comensales,tiempo, id_dificultad} = req.body;
    console.log('Cantidad de comensales recibida:', comensales);
    const userId = req.session.userId; 
    console.log('Valor de req.session.id_usuario:', req.session.userId);
    // Verificar si se recibió la imagen
   
    const imagen = req.file ? req.file.filename : null;
    console.log("Ruta del archivo guardado:", req.file.filename);
    // Verificar si se recibió la lista de ingredientes
    const ingredientes = req.body.ingredientes ? JSON.parse(req.body.ingredientes) : [];
    const pasos = req.body.pasos ? JSON.parse(req.body.pasos) : [];
    // Crear la receta
    const recetaId = await Receta.crearReceta(titulo, descripcion, supermercado, imagen,id_categoria,comensales,tiempo,userId,id_dificultad);

    // Agregar ingredientes a la receta
    const ingredientesPromises = ingredientes.map(async (ingrediente) => {
      const { nombre_ingrediente, cantidad, unidad } = ingrediente;


if (nombre_ingrediente !== null && nombre_ingrediente !== undefined) {
  // Utiliza la información del ingrediente para crear un ingrediente
  await Ingrediente.agregarIngrediente(recetaId, nombre_ingrediente, cantidad, unidad);
} else {
  console.error('Error: El nombre del ingrediente no puede ser nulo');
  // Puedes decidir si quieres lanzar una excepción, devolver un error o tomar alguna otra acción apropiada.
}
    });
  // Agregar pasos a la receta
  const pasosPromises = pasos.map(async (paso) => {
    const { titulo_paso, descripcion_paso } = paso;

    if (titulo_paso !== null && titulo_paso !== undefined) {
      await Paso.agregarPaso(recetaId, titulo_paso, descripcion_paso);
    } else {
      console.error('Error: El título del paso no puede ser nulo');
    }
  });

  // Esperar a que todas las consultas de ingredientes y pasos se completen
  await Promise.all([...ingredientesPromises, ...pasosPromises]);

  res.json({ id_receta: recetaId });
} catch (error) {
  console.error('Error al crear la receta:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
}
}
async function obtenerRecetas(req, res) {
  try {
    const recetas = await obtenerTodasLasRecetas();
    res.json(recetas);
  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

   async function obtenerCategorias(req, res) {
    try {
      const categorias = await Categoria.obtenerCategorias();
      res.json(categorias);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async function obtenerDificultades(req, res) {
    try {
      const categorias = await Dificultad.obtenerDificultades();
      res.json(categorias);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  async function getRecetasByUsuario(req, res) {
    try {
      const usuarioId = req.session.userId; // Obtén el ID del usuario de la sesión
  
      // Llama a la función del modelo para obtener las recetas del usuario
      const recetas = await Receta.getRecetasByUsuario(usuarioId);
  
      res.json(recetas);
    } catch (error) {
      console.error('Error al obtener las recetas del usuario:', error);
      res.status(500).json({ error: 'Error al obtener las recetas del usuario' });
    }
  }




async function obtenerUnidadesMedida(req, res) {
  try {
    const unidadesMedida = await UnidadMedida.obtenerUnidadesMedida();
    res.status(200).json(unidadesMedida);
  } catch (error) {
    console.error('Error al obtener unidades de medida:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}




const obtenerDetallesRecetaCompleta = async function(req, res) {
  const idReceta = req.params.id;

  RecetaModel.obtenerDetallesRecetaCompleta(idReceta, (err, detallesReceta) => {
    if (err) {
      console.error('Error al obtener los detalles completos de la receta:', err);
      res.status(500).json({ error: 'Error al obtener los detalles completos de la receta' });
      return;
    }

    res.status(200).json(detallesReceta);
  });
};
async function votarReceta(req, res) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const idReceta = req.params.idReceta;
    const idUsuario = req.session.userId;
    const puntuacion = req.body.puntuacion;
    const comentario = req.body.comentario;

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 5.' });
    }

    // Verificar si el comentario está presente
    if (!comentario || comentario.trim() === '') {
      return res.status(400).json({ error: 'Debe proporcionar un comentario.' });
    }

    // Verificar si el usuario ya ha votado por esta receta
    const haVotado = await Voto.verificarVotoUsuario(idUsuario, idReceta);

    if (haVotado) {
      // Si el usuario ya ha votado, actualizar su voto
      await Voto.actualizarVotoReceta(idUsuario, idReceta, puntuacion, comentario);
    } else {
      // Si el usuario no ha votado, registrar su voto
      await Voto.registrarVotoReceta(idUsuario, idReceta, puntuacion, comentario);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al votar por la receta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function quitarVotoReceta(req, res) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const idReceta = req.params.idReceta;
    const idUsuario = req.session.userId;

    // Verificar si el usuario ya ha votado por esta receta
    const haVotado = await Voto.verificarVotoUsuario(idUsuario, idReceta);

    if (haVotado) {
      // Si el usuario ha votado, quitar su voto
      await Voto.quitarVotoReceta(idUsuario, idReceta);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'El usuario no ha votado por esta receta.' });
    }
  } catch (error) {
    console.error('Error al quitar el voto por la receta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function obtenerPuntuacionTotalReceta(req, res) {
  try {
    const idReceta = req.params.idReceta;
    const puntuacionTotal = await Voto.obtenerPuntuacionTotalReceta(idReceta);

    // Si puntuacionTotal es null, devolver 0; de lo contrario, devolver el valor obtenido
    const resultado = { puntuacion_total: puntuacionTotal === null ? 0 : puntuacionTotal };

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener la puntuación total de la receta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
async function buscarRecetas(req, res) {
  try {
    const { titulo, id_categoria, comensales } = req.query;
    console.log('Parámetros recibidos:', { titulo, id_categoria, comensales });

    // Verificar si no se proporciona ningún parámetro para la búsqueda
    if (!titulo && !id_categoria && !comensales) {
      res.status(400).json({ error: 'Debe proporcionar al menos un título, una categoría o el número de comensales' });
      return;
    }

    // Llama a la función de búsqueda general en el modelo
    let recetasResult;

    if (titulo && id_categoria && comensales) {
      // Búsqueda por título, categoría y comensales
      recetasResult = await searchRecetas(titulo, id_categoria, comensales);
    } else if (titulo && id_categoria) {
      // Búsqueda por título y categoría
      recetasResult = await searchRecetas(titulo, id_categoria, null);
    } else if (titulo && comensales) {
      // Búsqueda por título y comensales
      recetasResult = await searchRecetas(titulo, null, comensales);
    } else if (id_categoria && comensales) {
      // Búsqueda por categoría y comensales
      recetasResult = await searchRecetas(null, id_categoria, comensales);
    } else if (titulo) {
      // Búsqueda solo por título
      recetasResult = await searchRecetas(titulo, null, null);
    } else if (id_categoria) {
      // Búsqueda solo por categoría
      recetasResult = await searchRecetas(null, id_categoria, null);
    } else {
      // Búsqueda solo por cantidad de comensales
      recetasResult = await searchRecetas(null, null, comensales);
    }

    if (recetasResult.length === 0) {
      res.status(404).json({ error: 'Recetas no encontradas' });
    } else {
      res.json(recetasResult);
    }
  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    res.status(500).json({ error: 'Error al obtener las recetas' });
  }
}





module.exports = { crearRecetaConIngredientes,getRecetasByUsuario,obtenerRecetas,obtenerCategorias,buscarRecetas,obtenerDificultades,obtenerPuntuacionTotalReceta,votarReceta,quitarVotoReceta,obtenerUnidadesMedida,obtenerDetallesRecetaCompleta };
