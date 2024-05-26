const passport = require("passport");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Receta, CategoriaReceta} = require('../models/index');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const getCaloriasCalculadora = async (request, response, error) => {
    const { sexo, edad, peso, altura, actividad_fisica } = req.params;
    let caloriasRecomendadas = 0;

    if (sexo === 'hombre') {
      caloriasRecomendadas = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
    } else if (sexo === 'mujer') {
      caloriasRecomendadas = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
    }

    switch (actividad_fisica) {
      case 'nada':
        caloriasRecomendadas *= 1.2;
        break;
      case 'baja':
        caloriasRecomendadas *= 1.375;
        break;
      case 'media':
        caloriasRecomendadas *= 1.55;
        break;
      case 'alta':
        caloriasRecomendadas *= 1.725;
        break;
      case 'muy alta':
        caloriasRecomendadas *= 1.9;
        break;
      default:
        break;
    }
    
    if (!caloriasRecomendadas) {
        return response.status(404).json({caloriasRecomendadas, message: 'Receta no encontrada' });
      }
    response.status(201).json(caloriasRecomendadas)
  }

  module.exports = {
    getCaloriasCalculadora, // Añade la función calcularCalorias aquí
  };