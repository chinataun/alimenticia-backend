const passport = require("passport");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Receta, Producto, CategoriaReceta, Compra } = require('../models/index');
const path = require('path');
const axios = require('axios');

const getUser = async (req, res) => { 
  const { userId } = req.query;
  try {
  
    const usuario = await User.findByPk(userId,
      { 
        attributes: { exclude: [ 'password', 'createdAt', 'updatedAt']},
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
          },
          {
            model: Receta,
            as: 'votadas',
            through: { attributes: [] }, // Esto excluye los atributos de la tabla intermedia
            include: [
              {
                model: CategoriaReceta,
                as: 'categoriaReceta',
              },
            ],
          },
        ]
      }
    );
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    console.log(usuario)
    res.status(200).json(usuario);
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al obtener el usuario', error });
  }
};

const deleteUser = async (req, res) => { 
  const { userId } = req.query;
  console.log(userId)
  try {
  
    const usuario = await User.destroy({
      where: {
        id: userId // Reemplaza esto con el ID del usuario que quieres eliminar
      }
    });
    console.log(usuario)
    res.status(200).json({ success: false, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al obtener el usuario', error });
  }
};

const newUser = async (req, res) => {

    // const { username, password, apodo, email, imagen } = req.body;
    const { username, email, cp, password } = req.body;
    // Validamos si el usuario ya existe en la base de datos
    const user = await User.findOne({ where: { email: email } });

    if(user) {
       return res.status(400).json({
            msg: `Ya existe un usuario con el nombre ${username}`
        })
    } 

   const hashedPassword = await bcrypt.hash(password, 10);
    
    // const hashedPassword = await bcrypt.hash(contrasena, 10);
    try {
        // Guardarmos usuario en la base de datos
      const user = await User.create({
        username: username,
        password: hashedPassword,
        email: email,
        cp: cp,
        imagen: "public/images/user-default.png"
      })

      const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY || 'SECRET', {expiresIn: "24h"});

      res.status(201).json({ token: token, 
          msg: `Usuario ${username} creado con éxito!`
      })
    } catch (error) {
      console.log('error', error);
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

const loginUser = async (req, res) => {

  if (req.user) {
    const token = jwt.sign({userId: req.user.id}, process.env.SECRET_KEY || 'SECRET', {expiresIn: "24h"});
    return res.status(200).json({ token, msg: 'Inicio de sesión exitoso'});
  } else {
    return res.status(401).json({ msg: req.info.message});
  }
}

const updateUser = async (req, res) => {
  const { username, nombre, apellidos, apodo, cp, email, userId, supermercado } = req.body;
  const imagen = req.file ? req.file.path : null; // usa el path del archivo si se subió uno

  // const { userId } = req.query;

  try {
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const usuarioUpdated = {
      username: username? username : usuario.username,
      nombre: nombre? nombre : usuario.nombre,
      apellidos: apellidos? apellidos : usuario.apellidos,
      apodo: apodo? apodo : usuario.apodo,
      email: email? email : usuario.email,    
      cp: cp? cp : usuario.cp,  
      supermercado: supermercado? supermercado : usuario.supermercado,
      imagen: imagen? imagen : usuario.imagen  
    }     
   
    await usuario.update(usuarioUpdated);
    
    res.status(201).json({ success: true, message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el usuario', error });
  }

}

const checkPassword = async (req, res) => {
  try { 
    console.log(req.query)
    const { userId, oldPassword } = req.query;


    const user = await User.findOne({ where: { id: userId } });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json(false);
    }
    return res.json(true);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
}

const changePassword = async (req, res) => {

  const { userId } = req.query;
  const { newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ msg: 'Contraseña cambiada con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
}

const setSupermarketFavorite = async (req, res) => {
  const { userId } = req.query;
  const { name } = req.body;
  try {
    const user = await User.findByPk(userId);
    // const supermarket = await Supermarket.findByPk(supermarketId);
    // await user.addSupermarket(supermarket);
    userUpdated = await user.update({supermercado: name});
    console.log(userUpdated)

    res.json({ user: userUpdated, msg: 'Supermercado añadido a favoritos' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
}

const getListasCompras = async (req, res) => { 
  const { userId } = req.query;

  try {

    const usuario = await User.findByPk(userId);
    
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    const compras = await usuario.getCompras({
      attributes: ['id','carrito']
    });
    const carritos = compras.map(compra => ({
      id: compra.id,
      carrito: JSON.parse(compra.carrito)
    }));
    
    res.status(200).json(carritos);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el usuario', error });
  }
};

const setListasCompras = async (req, res) => {
  const { carrito, userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    const compras = await user.getCompras();
    console.log(compras);
    const carritoStr = JSON.stringify(carrito);
    for (let compra of compras) {
      if (compra.carrito === carritoStr) {
        return res.status(202).json({ msg: 'Ya has guardado este carrito' });
      }
    }
    await user.createCompra({carrito: carritoStr});
    res.json({ carrito, msg: 'Carrito guardado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
}


const setCp = async (req, res) => {
  const { userId, cp } = req.query;
  // const { cp } = req.body;
  console.log(req.query)
  console.log(req.body)
  try {
    const user = await User.findByPk(userId);
    // const supermarket = await Supermarket.findByPk(supermarketId);
    // await user.addSupermarket(supermarket);
    userUpdated = await user.update({cp: cp});
    // console.log(userUpdated)

    res.json({ user: userUpdated, msg: 'Supermercado añadido a favoritos' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
}

const getSupermarket = async (req, res) => {
  const { cp } = req.query;
  try {
    const postalCode = cp;
    const apiKey = process.env.API_KEY_PLACES; // Reemplaza esto con tu clave de API de Google
    const ratio = '2000'
    const apiKeyMAPS = process.env.API_KEY_MAPS; 



    const coordenadas = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: `postal code ${postalCode}, Spain`,
        key: process.env.API_KEY_PLACES,
      },
    });
    const types = [
      "supermarket",
      "grocery_or_supermarket",
      "home_goods_store",
      "bakery",
      "food",
      ];
    console.log(coordenadas.data.results[0].geometry.location);
    console.log(coordenadas.data.results[0].geometry.location);
    const { lat, lng } = coordenadas.data.results[0].geometry.location;
    console.log(postalCode);
    console.log(apiKey);
    var latlang = {
      "latitude":lat,
      "longitude":lng, 
  };
  var p = latlang.latitude + ',' + latlang.longitude
    // Haz una solicitud a la API de Google Places
    // const response = await axios.get(`https://places.googleapis.com/v1/places:searchNearby?location=${postalCode}&radius=5000&type=supermarket&key=${apiKey}`);
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${p}&radius=${ratio}&type=supermarket&key=${apiKeyMAPS}`);



    // const response = await axios.post(`https://places.googleapis.com/v1/places:searchNearby`, {
    //   location: postalCode,
    //   radius: 5000,
    //   type: 'supermarket',
    //   key: apiKey
    // });

    const places = response.data.results;
    // console.log(places);
    const markets = []
    places.forEach(place => {
      markets.push({
        name: place.name.toLowerCase(),
        address: place.vicinity,
        location: place.geometry.location,
        rating: place.rating,
      });

      
    });
    // console.log(coordenadas);

    // Filtra los resultados para incluir solo los supermercados que te interesan
    const supermarkets = markets.filter(place => ['dia', 'Supermercados Dia', 'eroski', 'alcampo', 'ahorramas'].includes(place.name.toLowerCase()));
    
    res.json(supermarkets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error al buscar supermercados', error });
  }
};


const deleteCarritoUser = async (req, res) => { 
  const { userId, id } = req.query;
  console.log(id)
  try {
    const user = await User.findByPk(userId);
    const compra = await user.getCompras(
      { where: { id: id } }
    );
    if (!compra) {
      return res.status(404).json({ success: false, message: 'Compra no encontrada' });
    }
    await user.removeCompras(compra);

    const compras = await user.getCompras({
      attributes: ['id','carrito']
    });
    const carritos = compras.map(compra => ({
      id: compra.id,
      carrito: JSON.parse(compra.carrito)
    }));
    
    res.status(200).json(carritos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
}

module.exports = {
    getUser,
    newUser,
    loginUser, updateUser,
    changePassword,
    checkPassword,
    getSupermarket,
    setSupermarketFavorite,
    setCp,
    getListasCompras,
    setListasCompras,
    deleteUser,
    deleteCarritoUser
  };
  