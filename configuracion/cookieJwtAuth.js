const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.cookies.token;
  console.log(req.cookies)
  console.log(token)
  if (!token) return res.status(401).json({ message: "No autorizado" });
  
  try {
    const decoded = jwt.verify(token, "SECRET"); // Verifica el token con tu secreto
    req.user = decoded.user; // Agrega el ID del usuario al objeto de solicitud
    next(); // Continúa con la siguiente función de middleware
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
  } else {
            // Tiene token
          try {
              jwt.verify(token, process.env.SECRET_KEY || 'SECRET')
              //, (err, user) => {
                //if (err) return res.sendStatus(403)
                //console.log(next)
                //req.user = user
                next()
              //})
          } catch (error) {
            console.log(error)
              res.status(401).json({
                  msg: 'token no valido'
              })
          }
  }


}

module.exports = {authenticate, authenticateToken}