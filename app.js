//Import express
const express = require('express');
const app = express();
app.use(express.json());
//import libros
const routerLibros = require('./routes/libros');
//import el Middleware Error Handler
const errorHandler = require('./middleware/errorHandler');


//Define puerto
const port = 3000;
//Puerto a la escucha
app.listen(port, () =>{
    console.log('The server is runing in the port 3000');
});

//llamado de libros
app.use('/libros',routerLibros);
//Manejo de errores
app.use(errorHandler);