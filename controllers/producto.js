// controllers/alimentosController.js
const { json } = require('body-parser');
const stringSimilarity = require('string-similarity');
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

const Beneficio = require('../models/beneficio');
const { Producto } = require('../models/index');
const { port,db, sequelize } = require('../config');
const { Op, QueryTypes } = require('sequelize');
const Fuse = require('fuse.js');

const indexElastic = async (req, res) => {
  
  const productos = await Producto.findAll();
  for (let producto of productos) {
    await client.index({
      index: 'productos',
      body: producto
    });
  }
  res.json({msg: "Productos indexados correctamente"});

}

const getProductosXTermino = async (req, res) => {

  const { termino } = req.params;
  const { marca } = req.query;
  console.log('Marca', marca);
  console.log('Termino', termino);
 try  {
  //findAll donde el termino pueda esta encluido en el nombre o en la SubCategoriaNuestra
  const lowerCaseTerm = termino.toLowerCase();

  const productos = await Producto.findAll({
    where: {
      supermercado: marca,
      [Op.and]: [
        // sequelize.where(
        //   sequelize.fn('LOWER', sequelize.col('nombre')),
        //   { [Op.like]: '%' + lowerCaseTerm + '%' }
        // ),
        sequelize.literal(`FIND_IN_SET('${lowerCaseTerm}', REPLACE(LOWER(nombre), ' ', ','))`),

      ]
      // [Op.or]: [
      //   { nombre: { [Op.like]: `%${termino}%` } },
      //   // { categoriaNuestra: { [Op.like]: `%${termino}%` } },
      //   // { SubCategoriaNuestra: { [Op.like]: `%${termino}%` } }
      // ]
    }
  });


  
  res.json(productos);
    // console.log('Resultados', rows);
    // return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error al obtener la búsqueda desde la base de datos:', error);
    return null;
  }

};

const getProductoSimilar = async (req, res) => {
  const {producto} = req.query;
  const productojson = JSON.parse(producto);
  console.log('Producto', productojson);
  

  let supers = ['dia', 'ahorramas', 'eroski', 'alcampo'];
  const index = supers.indexOf(productojson.supermercado);
  if (index > -1) {
    supers.splice(index, 1);
  }
  // iterar los elementos del producto
  // buscar productos con nombre similar
  // calcular similitud
  // devolver el producto con mayor similitud
  // for (const [clave, valor] of Object.entries(producto)) {
  //   console.log(`${clave}: ${valor}`);
  // }

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const productosSimilares = await Producto.findAll({
    where: {
      // [Op.and]: [
      //   sequelize.where(
      //     sequelize.fn('LOWER', sequelize.col('marca')),
      //     { [Op.like]: sequelize.fn('LOWER', `%${productojson.marca}%`) }
      //   ),
      //   {
      //     [Op.or]: [
      //       { categoriaNuestra: productojson.categoriaNuestra },
      //       { subCategoriaNuestra: productojson.subCategoriaNuestra }
      //     ]
      //   }
      // ],
      supermercado: { [Op.in]: supers },
      // [Op.or]: [
      //   { categoriaNuestra: { [Op.like]: `%${productojson.categoriaNuestra}%` } },
      //   { SubCategoriaNuestra: { [Op.like]: `%${productojson.subCategoriaNuestra}%` } }
      // ]
    }
  });

  // console.log('Productos similares', productosSimilares);
  // const productos = await Producto.findAll({
  //   where: {
  //     super: 'ahorramas',
  //     [Op.or]: [
  //       { nombre: { [Op.like]: `%${productojson.nombre}%` } },
  //       { categoriaNuestra: { [Op.like]: `%${productojson.categoriaNuestra}%` } },
  //       { SubCategoriaNuestra: { [Op.like]: `%${productojson.subCategoriaNuestra}%` } }
  //     ]
  //   }
  // });
  // console.log('Productos', productos);
  // let maxSimilarity = 0;
  // let maxSimilarityMarca = 0;
  // let productoSimilar = null;
  // let productoMarcaSimilar = null;

//   let maxSimilarity = {};
// let maxSimilarityMarca = {};
// let productoSimilar = {};
// let productoMarcaSimilar = {};
let results = {};
supers.forEach((supermercado) => {
  results[supermercado] = {
      maxSimilarity : 0,
      maxSimilarityMarca : 0,
      productoSimilar : null,
      productoMarcaSimilar : null
    };
      
});
 
let haymarca = false;
  // const similarityMarca2 = stringSimilarity.compareTwoStrings("Central Lechera Asturiana", "ASTURIANA");
  // console.log('Similaridad marca', similarityMarca2);
  productosSimilares.forEach((prod) => {
    const supermercadoProd = prod.supermercado;
    //Normalizacion de la dcadena de texto
    const normalizarTexto = (texto) => texto.toLowerCase().trim();
    let nombreJson = normalizarTexto(productojson.nombre);
    let nombreProd = normalizarTexto(prod.nombre);
    // Puntos a comas
    // nombreJson = nombreJson.replace(".", ",");
    // nombreProd = nombreProd.replace(".", ",");
    //Numero+Letra 2L -> 2 L

      // nombreJson = nombreJson.replace(/(\d)([a-zA-Z])/g, "$1 $2");
      // nombreProd = nombreProd.replace(/(\d)([a-zA-Z])/g, "$1 $2");
  

    // if  (productojson.super == 'dia' && productojson.categoriaNuestra == 'Agua, refrescos y zumos') {
    //   nombreJson = nombreJson.replace(/(\d+)\s*x\s*(\d+)\s*(cl|l|ml)/g, "pack $1 x $2 $3");
    // } else if( prod.super == 'dia' && prod.categoriaNuestra == 'Agua, refrescos y zumos') {
    //   nombreProd = nombreProd.replace(/(\d+)\s*x\s*(\d+)\s*(cl|l|ml)/g, "pack $1 x $2 $3");
    // } 

    // if (!nombreJson.includes("botella")) {
    //   nombreJson = nombreJson.replace(/(\d+)\s*(l)/g, "$1 $2 botella");
    // }
    // if (!nombreProd.includes("botella")) {
    //   nombreProd = nombreProd.replace(/(\d+)\s*(l)/g, "$1 $2 botella");
    // }
    // cadena = cadena.replace(/(\d+)\s*x\s*(\d+)/g, "pack $1x$2");

// "pack 12x33cl"
    //Acentos
    nombreJson = nombreJson.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    nombreProd = nombreProd.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    marcaJson = productojson.marca;
    marcaProd = prod.marca;
    if (esMarcaSimilar(marcaJson, marcaProd)) {
      const similarityMarcados = stringSimilarity.compareTwoStrings(marcaJson, marcaProd);
      // console.log('Similaridad marca', similarityMarcados);
      if (similarityMarcados > 0.8) {
        console.log('Productojs',nombreJson);
        console.log('Producto', nombreProd);
        const similarityNombre = stringSimilarity.compareTwoStrings(nombreJson, nombreProd);
        console.log('Similaridad nombre guardado', similarityNombre);

        // const fuseExacto = new Fuse(prod, opcionesBusquedaExacta);
        // const resultadosExactosFuse = fuseExacto.search(nombreProductoNormalizado);
        // console.log('Resultados exactos Fuse', resultadosExactosFuse);

        haymarca = true;
        if (similarityNombre > results[supermercadoProd].maxSimilarityMarca && similarityNombre > 0.5) {
          // console.log('Similaridad nombre', similarityNombre);
          console.log('Productojs',nombreJson);
          console.log('Producto', nombreProd);
          
          results[supermercadoProd].maxSimilarityMarca = similarityNombre;
          // productoSimilar = prod;
          results[supermercadoProd].productoMarcaSimilar = prod;
                 
        }
        // console.log('Similaridad nombre', similarityNombre);
      }
        
      // const isM = esCategoriaSimilar(productojson.categoriaNuestra, prod.categoriaNuestra);
      // console.log('Similaridad nombre', similarityNombre);
          // const similarityTotal = (similarityNombre + 1 + similaritycategoria + similaritySubCategoria) / 4;
          
      // console.log('Similaridad total', similarityTotal);
      

      // if (isM) {
      //   // console.log(productojson.categoriaNuestra, prod.categoriaNuestra)
      //   // console.log('Producto', prod);
      // }
    } else {

      haymarca = false;
      const similarityNombre = stringSimilarity.compareTwoStrings(nombreJson, nombreProd);
      // console.log('Productojs',nombreJson);
      // console.log('Producto', nombreProd);
      // console.log('Similaridad nombre', similarityNombre);
      // const find = stringSimilarity.findBestMatch(productojson.nombre, prod.nombre);
      // console.log('Similaridad nombre', similarityNombre);
      // const find2 = stringSimilarity.findBestMatch(nombreProductoNormalizado, nombreProductoNormalizado2);
      // console.log('Similaridad nombre', find2);
      
      if (similarityNombre > results[supermercadoProd].maxSimilarity && similarityNombre > 0.45) {
        console.log('Productojs',nombreJson);
        console.log('Producto', nombreProd);
        console.log('Similaridad nombre guardado', similarityNombre);
        
        results[supermercadoProd].maxSimilarity = similarityNombre;
        results[supermercadoProd].productoSimilar = prod;

        // const similaritycatcat = stringSimilarity.compareTwoStrings(productojson.categoriaNuestra, prod.categoriaNuestra);

        // const similaritycatSub = stringSimilarity.compareTwoStrings(productojson.categoriaNuestra, prod.subCategoriaNuestra);
        // const similaritysubcat = stringSimilarity.compareTwoStrings(productojson.subCategoriaNuestra, prod.categoriaNuestra);
        // const similaritysubSub = stringSimilarity.compareTwoStrings(productojson.subCategoriaNuestra, prod.subCategoriaNuestra);
        // console.log('Similaridad categoria', similaritycatcat);
        // console.log('Similaridad subcategoria', similaritycatSub);

        // console.log('Similaridad categoria', similaritysubcat);
        // console.log('Similaridad subcategoria', similaritysubSub);
        
     
      }

    }

    // if (prod.super in maxSimilarity) {
    //   let similarity = calcularSimilitud(prod.nombre, productojson.nombre);
    //   let similarityMarca = calcularSimilitud(prod.marca, productojson.marca);
  
    //   if (similarity > maxSimilarity[prod.super]) {
    //     maxSimilarity[prod.super] = similarity;
    //     productoSimilar[prod.super] = prod;
    //   }
  
    //   if (similarityMarca > maxSimilarityMarca[prod.super]) {
    //     maxSimilarityMarca[prod.super] = similarityMarca;
    //     productoMarcaSimilar[prod.super] = prod;
    //   }
    // }


    // const similarityMarca = stringSimilarity.compareTwoStrings(productojson.marca, prod.marca);
  
// console.log('Similaridad marca', similarityMarca);
//     const similaritySubCategoria = stringSimilarity.compareTwoStrings(productojson.subCategoriaNuestra, prod.subCategoriaNuestra);
// // console.log('Similaridad subcategoria', similaritySubCategoria);
//     const similaritycategoria = stringSimilarity.compareTwoStrings(productojson.categoriaNuestra, prod.categoriaNuestra);
// // console.log('Similaridad categoria', similaritycategoria);

//     const similarityNombre = stringSimilarity.compareTwoStrings(productojson.nombre, prod.nombre);
// console.log('Similaridad nombre', similarityNombre);
//     const similarityTotal = (similarityNombre + 1 + similaritycategoria + similaritySubCategoria) / 4;
// // console.log('Similaridad total', similarityTotal);

//     if (similarityTotal > 0.7 && similarityTotal > maxSimilarity) {
//       maxSimilarity = similarityTotal;
//       productoSimilar = prod;
//     }
//   
});

  // if (!results[prod.super].productoSimilar && !results[prod.super].productoMarcaSimilar) {
  //   return res.status(200).json({ error: 'Producto similar no encontrado' });
  // }
        
  
  res.status(200).json(results);

}

function esCategoriaSimilar(categoria1, categoria2) {
  // Convertir ambas subCategorias a minúsculas
  categoria1 = categoria1.toLowerCase();
  categoria2 = categoria2.toLowerCase();

  // Dividir las subCategorias en tokens
  const tokens1 = categoria1.split(' ');
  const tokens2 = categoria2.split(' ');

  // Buscar si alguna de las subCategorias contiene alguno de los tokens de la otra
  for (const token1 of tokens1) {
    for (const token2 of tokens2) {
      if (token1 === token2) {
        return true;
      }
    }
  }

  // Si no se encontró ninguna coincidencia, las subCategorias no son similares
  return false;
}

function esSubCategoriaSimilar(subCategoria1, subCategoria2) {
  // Convertir ambas subCategorias a minúsculas
  subCategoria1 = subCategoria1.toLowerCase();
  subCategoria2 = subCategoria2.toLowerCase();

  // Dividir las subCategorias en tokens
  const tokens1 = subCategoria1.split(' ');
  const tokens2 = subCategoria2.split(' ');

  // Buscar si alguna de las subCategorias contiene alguno de los tokens de la otra
  for (const token1 of tokens1) {
    for (const token2 of tokens2) {
      if (token1 === token2) {
        return true;
      }
    }
  }

  // Si no se encontró ninguna coincidencia, las subCategorias no son similares
  return false;
}

function esMarcaSimilar(marca1, marca2) {
  // Convertir ambas marcas a minúsculas
  marca1 = marca1.toLowerCase();
  marca2 = marca2.toLowerCase();

  // Dividir las marcas en tokens
  const tokens1 = marca1.split(' ');
  const tokens2 = marca2.split(' ');

  // Buscar si alguna de las marcas contiene alguno de los tokens de la otra
  for (const token1 of tokens1) {
    for (const token2 of tokens2) {
      if (token1 === token2) {
        return true;
      }
    }
  }

  // Si no se encontró ninguna coincidencia, las marcas no son similares
  return false;
}
function calcularSimilitud(string1, string2) {
  return stringSimilarity.compareTwoStrings(string1, string2);
}

function compareStringsMaxWords(string1, string2) {
  // Divide las cadenas en palabras
  const words1 = string1.split(' ');
  const words2 = string2.split(' ');

  // Calcula el número máximo de palabras
  const maxWords = Math.max(words1.length, words2.length);

  // Cuenta cuántas palabras son iguales
  const sameWords = words1.filter(word => words2.includes(word)).length;

  // Calcula la similitud como el número de palabras iguales dividido por el número máximo de palabras
  const similarity = sameWords / maxWords;

  return similarity;
}

module.exports = {
  getProductosXTermino,
  getProductoSimilar,
  indexElastic
};
  