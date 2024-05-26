
const CalculadoraCaloriasModel=require('../models/modelCalculadoraCalorias')
const calcularCalorias = (req, res) => {
    try {
      const { sexo, edad, peso, altura, actividad_fisica } = req.body;
      const caloriasRecomendadas = CalculadoraCaloriasModel.calcularCalorias({
        sexo, edad, peso, altura, actividad_fisica,
      });
      res.json({ caloriasRecomendadas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};




const calcularCaloriasUsuarioRegistrado = (req, res) => {
  console.log('Entro en calcularCaloriasUsuarioRegistrado');
  console.log('req.user:', req.user);
  
  const datosCalculadora = req.body; // Datos de la calculadora enviados por el cliente
  console.log('datosCalculadora:', datosCalculadora);
  
  if (!datosCalculadora || !datosCalculadora.sexo || !datosCalculadora.edad || !datosCalculadora.peso || !datosCalculadora.altura || !datosCalculadora.actividad_fisica) {
    return res.status(400).json({ error: 'Faltan datos de la calculadora' });
  }

  const caloriasRecomendadas = CalculadoraCaloriasModel.calcularCalorias(datosCalculadora);

  if (caloriasRecomendadas < 0) {
    return res.status(400).json({ error: 'No se pudo calcular las calorías recomendadas' });
  }

  // Guarda los datos en la tabla calculadora_calorias
  CalculadoraCaloriasModel.guardarCalculadoraCalorias(datosCalculadora)
    .then((calculadoraCaloriasId) => {
      const usuarioId = req.user.id; // Obtiene el ID del usuario registrado
      console.log('usuarioId:', usuarioId);

      // Guarda los datos en la tabla calorias_usuario
      return CalculadoraCaloriasModel.guardarCaloriasUsuario(usuarioId, calculadoraCaloriasId, caloriasRecomendadas);
    })
    .then(() => {
      res.json({
        message: 'Datos guardados correctamente',
        caloriasRecomendadas: caloriasRecomendadas, // Agregamos las calorías recomendadas
      });
    })
    .catch((error) => {
      console.error('Error en calcularCaloriasUsuarioRegistrado:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    });
};



module.exports = {
  calcularCalorias,
  calcularCaloriasUsuarioRegistrado
};
