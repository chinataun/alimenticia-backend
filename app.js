const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config();

const session = require('express-session'); // Agrega esta línea
const usuariosRouter = require('./routers/usuarioRouter')

const calculadoraCaloriasRouter= require('./routers/calculadoraCaloriasRouter')

const listaCompraRouter = require('./routers/listaCompraRouter')
const receta = require('./routers/routerRecetas2023')
const { QueryTypes } = require('sequelize');
//routes
const userRouter = require('./routers/userRouter')
const recetaRouter = require('./routers/recetaRouter')
const alimentosRouter = require('./routers/alimentosRouter')
const productosRouter = require('./routers/productosRouter')
const categoriasRouter = require('./routers/categoriasRouter')
const dieteticaRouter = require('./routers/dieteticaRouter')
const apiFoods = require('./routers/ApiFoodsRouter');

// Modelos
const User = require('./models/user');
const { Sequelize } = require('sequelize');
const Receta = require('./models/receta');
const {testConnection} = require('./models/index')

const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { sequelize } = require('./config');
const methodOverride = require('method-override')
const cors = require('cors');
const bodyParser = require('body-parser');;
const normalizeString = (str) => str.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
const path = require("path");
const {authenticate, authenticateToken} = require('./configuracion/cookieJwtAuth')
const passport = require('passport');
require('./configuracion/passport')

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  
  // origin: 'https://alimenticia.es',
  credentials: true, // Habilita las cookies y credenciales de sesión
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cookieParser('SECRET'))
app.use(
  session({
    secret: 'SECRET', // Cambia esto a una cadena de secreto segura
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);
// Inicializa Passport
//app.use(passport.initialize());
//app.use(passport.session());

app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.errores = req.flash("errores");
  // res.locals.registro = req.flash("registro");
  res.locals.user = req.usario || null;
  next();
});
// static files
// app.use(express.static('public'))
// Configurar la ruta para servir archivos estáticos desde la carpeta 'imagenes'
app.use('/imagenes/usuario-imagen', express.static(path.join(__dirname, 'imagenes', 'usuario-imagen')));
app.use('/imagenes/recetas-imagen', express.static(path.join(__dirname, 'imagenes', 'recetas-imagen')));

// app.use('/css', express.static(__dirname + 'public/css'))
app.use('/public/images', express.static(path.join(__dirname, 'public', 'images')))
app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

// app.use('/uploads', express.static(__dirname + 'public/uploads'))
// app.use('/js', express.static(__dirname + 'public/js'))

app.use('/apiFoods', apiFoods);
//app.use('/r', usuarioRouter);
app.use('/user',usuariosRouter )
app.use('/dietetica', calculadoraCaloriasRouter)
app.use('/lista_compras',listaCompraRouter)
app.use('/prueba',receta)
// app.use('/',(req, res) => {
//   res.send('Hola mundo');
// })
app.use('/api/user', userRouter);
app.use('/api/recetas', recetaRouter);
app.use('/api/alimentos', alimentosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);

app.use('/api/dietetica', dieteticaRouter);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

testConnection();

