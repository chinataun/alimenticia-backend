const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No autorizado" });
  
  try {
    const decoded = jwt.verify(token, "SECRET");
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
}


function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    return res.status(401).json({
    message: 'Acceso denegado'
    })
  } 
  else {
    
    try {
        jwt.verify(token, process.env.SECRET_KEY || 'SECRET')
          next()
    } catch (error) {
        res.status(401).json({
            msg: 'token no valido'
        })
    }
  }
}

module.exports = {authenticate, authenticateToken}