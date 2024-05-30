const passport = require("passport");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Receta, CategoriaReceta} = require('../models/index');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const addReceta = async (request, response, error) => {
    
    const { body } = request
    const imagen = request.file ? request.file.path : null; // usa el path del archivo si se subió uno

    try {
        const { titulo, supermercado, comensales,tiempo, ingredientes, pasos, categoriaId, dificultad, userId } = request.body;
        const usuario = await User.findByPk(userId);
        if (!usuario) {
          return response.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        const receta = await Receta.create({
            titulo: titulo,
            supermercado: supermercado,
            comensales: comensales,
            tiempo: tiempo,
            dificultad: dificultad,
            ingredientes: ingredientes,
            pasos: pasos,
            imagen: imagen ? imagen : "public/images/recetas-default.jpg",
            status: 0
        }).catch(error => { console.log('error', error) });
        
        await receta.setCategoriaReceta(categoriaId);
        await receta.setAutor(usuario);
        // attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt']}});
        // Devolvemos una respuesta al cliente con un mensaje de exito y la receta creada sin los campos updateAt y createAt.
        // Convert the Sequelize instance to a plain JavaScript object
        
  const recetaPlain = await Receta.findOne(
    {  
      where: { id: receta.id },
      include: [
        {
          model: User,
          as: 'autor',
        },
        {
          model: CategoriaReceta,
          as: 'categoriaReceta',
        }
      ],
  });

  const recetasModificadas = recetaPlain.toJSON();
  recetasModificadas.user = recetasModificadas.created;
    delete recetasModificadas.created;


  // Destructure the object to exclude 'createdAt' and 'updatedAt'
  const { createdAt, updatedAt, ...recetaWithoutTimestamps } = recetaPlain;

  response.status(201).json({
    msg: `Receta ${titulo} creado exitosamente!`,
    receta: recetasModificadas
  });      

    } catch (error) {
       console.log('error', error);
        // Si ocurre un error devolvemos una respuesta al cliente con un mensaje de error.
        response.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
        
    }

}

//dones
const getRecetas = async (request, response, error) => {
  try {
    const recetas = await Receta.findAll({
      include: [
        {
          model: User,
          as: 'favoriteadas',
        },
        {
          model: User,
          as: 'autor',
        },
        {
          model: CategoriaReceta,
          as: 'categoriaReceta',
        },
      ],
    });

    const recetasModificadas = recetas.map(receta => {
      const recetaJSON = receta.toJSON();
      recetaJSON.user = recetaJSON.created;
      delete recetaJSON.created;
      return recetaJSON;
    });
    response.json(recetasModificadas);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Server error' });
  }
}

const removeReceta = async (req, res) => {
  const { recetaId, userId } = req.body;
  try {
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    const receta = await Receta.findByPk(recetaId);
    if (!receta) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }

    await Receta.destroy({ where: { id: recetaId } });

    res.status(201).json({ success: true, message: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al agregar receta como favorita', error });
  }

}

const getReceta = async (request, response, error) => {
    const { id } = request.params
    const receta = await Receta.findByPk(id, {
      attributes: { 
        exclude: ['id', 'updatedAt']
      },
      include: [
        {
          model: User,
          as: 'autor',
        },
        {
          model: CategoriaReceta,
          as: 'categoriaReceta',
        },
        {
          model: User,
          as: 'votos',
        }
      ]
    });
      if (!receta) {
        return response.status(404).json({ success: false, message: 'Receta no encontrada' });
      }
    response.status(201).json(receta)
}

const editReceta = async (request, response, error) => {
    const { body } = request
    
    const imagen = request.files['imagenPrincipal'] ? request.files['imagenPrincipal'][0].path : null; // usa el path del archivo si se subió uno
    try {
      const { titulo, supermercado, comensales,tiempo, categoriaId, dificultad, userId, idReceta, ingredientes, pasos, status } = body

        const receta = await Receta.findByPk(idReceta);

        if (!receta) {
          return response.status(404).json({ success: false, message: 'Receta no encontrada' });
        }
        const recetaUpdated = {
            titulo: titulo? titulo : receta.titulo,
            supermercado: supermercado? supermercado : receta.supermercado,
            comensales: comensales? comensales : receta.comensales,
            tiempo: tiempo? tiempo : receta.tiempo,
            categoriaId: categoriaId? categoriaId : receta.categoriaId,
            dificultad: dificultad? dificultad : receta.dificultad,
            imagen: imagen? imagen : receta.imagen,            
            ingredientes: ingredientes? ingredientes: receta.ingredientes,
            pasos: pasos? pasos: receta.pasos,
            status: status? status: receta.status
        }     
       
       await receta.update(recetaUpdated);
        response.status(201).json({ success: true, message: 'Receta actualizada' });
      } catch (error) {
        response.status(500).json({ success: false, message: 'Error al actualizar la receta', error });
      }
    
    }

//dones
const getRecetasByUser = async (request, response, error) => {
  const { userId } = request.query;

  try {
    const usuario = await User.findByPk(userId
      , {
      include: [
        {
          model: Receta,
          as: 'creadas',
          include: [
            {
              model: User,
              as: 'autor',
            },
            {
              model: CategoriaReceta,
              as: 'categoriaReceta',
            },
          ],
        },
        {
          model: Receta,
          as: 'favoritas',
          include: [
            {
              model: User,
              as: 'autor',
            },
            {
              model: CategoriaReceta,
              as: 'categoriaReceta',
            },
          ],
        }
      ]
    });
    if (!usuario) {
      return response.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // const recetas = await usuario.getCreadas({
    //   include: [
    //     {
    //       model: User,
    //       as: 'autor',
    //     },
    //     {
    //       model: CategoriaReceta,
    //       as: 'categoriaReceta',
    //     },
    //   ],
    // });
    // const recetasModificadas = recetas.map(receta => {
    //   const recetaJSON = receta.toJSON();
    //   recetaJSON.user = recetaJSON.created;
    //   delete recetaJSON.created;
    //   return recetaJSON;
    // });
    response.status(200).json( usuario );

  } catch (error) {
      console.error('Error al obtener las recetas favoritas del usuario:', error);
      response.status(500).json({ success: false, message: 'Error al obtener las recetas favoritas del usuario' });    }
};



//dones
const getFavorites =  async (req, res) => {

  const { userId } = req.query;
  try {
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const recetasFavoritas = await usuario.getFavoritas({
      include: [
        {
          model: User,
          as: 'autor',
        },
        {
          model: CategoriaReceta,
          as: 'categoriaReceta',
        },
      ],
    });
    const recetasModificadas = recetasFavoritas.map(receta => {
      const recetaJSON = receta.toJSON();
      recetaJSON.user = recetaJSON.created;
      delete recetaJSON.created;
      return recetaJSON;
    });
    res.status(200).json( recetasModificadas );

  } catch (error) {
      console.error('Error al obtener las recetas favoritas del usuario:', error);
      res.status(500).json({ success: false, message: 'Error al obtener las recetas favoritas del usuario' });    }
};
const getCreated =  async (req, res) => {

  const { userId } = req.query;
  try {
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const recetasFavoritas = await usuario.getCreadas({
      include: [
        {
          model: User,
          as: 'autor',
        },
        {
          model: CategoriaReceta,
          as: 'categoriaReceta',
        },
      ],
    });
    const recetasModificadas = recetasFavoritas.map(receta => {
      const recetaJSON = receta.toJSON();
      recetaJSON.user = recetaJSON.created;
      delete recetaJSON.created;
      return recetaJSON;
    });
    res.status(200).json( recetasModificadas );

  } catch (error) {
      console.error('Error al obtener las recetas favoritas del usuario:', error);
      res.status(500).json({ success: false, message: 'Error al obtener las recetas favoritas del usuario' });    }
};
const removeRecetaFavorita = async (req, res) => {
    const { recetaId, userId } = req.body;
    try {
      const usuario = await User.findByPk(userId);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      const receta = await Receta.findByPk(recetaId);
      if (!receta) {
        return res.status(404).json({ success: false, message: 'Receta no encontrada' });
      }
      
      await usuario.removeFavoritas(receta);
      res.status(201).json({ success: true, message: 'Receta eliminada como favorita' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar la receta como favorita', error });
    }
  
}

const addRecetaFavorita = async (req, res) => {
    const { recetaId, userId } = req.body;
    
    try {
      const usuario = await User.findByPk(userId);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      const receta = await Receta.findByPk(recetaId);
      if (!receta) {
        return res.status(404).json({ success: false, message: 'Receta no encontrada' });
      }
      
      await usuario.addFavoritas(receta);
      res.status(201).json({ success: true, message: 'Receta agregada como favorita' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al agregar receta como favorita', error });
    }
  
}

const isVoted =  async (req, res) => {

  const { userId, recetaId } = req.query;
  try {
    const usuario = await User.findByPk(userId);
    const receta = await Receta.findByPk(recetaId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    if (!receta) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }

    const votos = await receta.getVotos({
      where: { id: userId }
    });

    if (votos.length > 0) {
      return res.status(200).json({voted: true, rating: votos[0].rating.rating, comment: votos[0].rating.comment});
    }
    return res.status(200).json({voted: false});
    
  } catch (error) {
    console.error('Error al obtener las recetas favoritas del usuario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las recetas favoritas del usuario' });    
  }
}

const votarReceta = async (req, res) => {
  const { idReceta, userId, puntuacion, comentario } = req.body;
  try {
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    const receta = await Receta.findByPk(idReceta);
    if (!receta) {
      return res.status(404).json({ success: false, message: 'Receta no encontrada' });
    }
    
    await usuario.addVotadas(receta, { through: { rating: puntuacion, comment: comentario } });

    const votes = await receta.getVotos();
    const averageRating = votes.reduce((a, b) => a + b.rating.rating, 0) / votes.length;

    await receta.update({ rating: averageRating });

    const recetaUpdated = await Receta.findByPk(idReceta, {
      include: [
        {
          model: User,
          as: 'autor',
        },
        {
          model: CategoriaReceta,
          as: 'categoriaReceta',
        },
        {
          model: User,
          as: 'votos',
        }
      ]
    });


    res.status(201).json({ receta: recetaUpdated, message: 'Receta votada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al votar receta', error });
  }

}

module.exports = {
    getRecetas, getReceta, addReceta, editReceta,removeReceta,
    getRecetasByUser,
    getFavorites,
    getCreated,
    addRecetaFavorita,
    removeRecetaFavorita,
    isVoted,
    votarReceta,
  };
  