const jwt = require('jsonwebtoken')

const tokenSign = async(user) => {
  return jwt.sign(
    {
      id: user.nombre,
    }, 
    'SECRET', 
    {
      expiresIn: "24h"
    }
  );
} 

const verifyToken = async(token) => {
  try {
    return jwt.verify(token, 'SECRET')  
  } catch (error) {
    return response.redirect("/");
  }
}

module.exports = {tokenSign, verifyToken}