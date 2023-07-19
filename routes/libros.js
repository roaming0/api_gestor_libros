//Import express
const express = require('express');
//import Data
const libros = require('../data');
const Joi = require('joi');
//define ruta
const routerLibros = express.Router();

//define esquema de validacion para entrada de datos
const libroSchema = Joi.object({
    titulo: Joi.string().required().label('titulo'),
    autor:Joi.string().required().label('autor'),
    precio:Joi.number().required().label('precio')
});
const libroSchemaPut = Joi.object({
    titulo: Joi.string().label('titulo'),
    autor:Joi.string().label('autor'),
    precio:Joi.number().label('precio')
});

//Llama a todos los libros
routerLibros.get('/', (req, res, next) =>{
    try{
        res.json(libros);
    }catch(err){
        next(err);
    };
});

//LLamar libros por ID
routerLibros.get('/:id', (req, res, next) => {
    try{
        id = parseInt(req.params.id);
        id -= 1;
        const libroBuscado = libros[id];
         //Control de errores por ID
        if(!libroBuscado){
            const error = new Error ('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        else{
            res.json(libroBuscado);
        };
    }catch(err){
        next(err);
    };
});

//Publicar nuevo libro
routerLibros.post('/', (req, res, next) =>{
    try{
        const valor = libroSchema.validate(req.body);
        if(valor.error){
            const error = new Error(valor.error);
            error.status = 400;
            throw error;
        }
        else if(req.body.precio <= 0){
            const errorPrecio = new Error('El precio no puede ser menor o igual a 0');
            errorPrecio.status = 400;
            throw errorPrecio;
        }
        else{
            let {titulo,autor,precio} = req.body;
            precio = parseInt(precio);
            const nuevoLibro = {
                id: parseInt(libros.id[libros.length]) + 1,
                titulo,
                autor,
                precio
            };
            libros.push(nuevoLibro);
            res.json(nuevoLibro).status(201);
        };
    }catch(err){
        next(err);
    };
});

//Modificar informacion
routerLibros.put('/:id', (req, res, next) =>{
    try{
        let id = req.params.id;
        id = id - 1;
        const {titulo, autor, precio} = req.body;
        const validacion = libroSchemaPut.validate(req.body)
        const libroBuscado = libros[id];

        if(!libros[id]){
            const IDerror = new Error('El libro buscado no existe');
            IDerror.status = 404;
            throw IDerror;
        }
        else if(validacion.error){
            const errValidacion = new Error(validacion.error)
            errValidacion.status = 400;
            throw errValidacion;
        }
        else if(precio <= 0){
            const precioError = new Error('El precio no puede ser menor o igual a 0')
            precioError.status = 400;
            throw precioError;
        }
        else{
            libroBuscado.titulo = titulo || libroBuscado.titulo;
            libroBuscado.autor = autor || libroBuscado.autor;
            libroBuscado.precio = precio || libroBuscado.precio;

            res.json(libroBuscado);
            }
    }catch(err){
        next(err);
    }
});

//Eliminar libro por ID
routerLibros.delete('/:id', (req, res, next) => {
    try{    
        let id = parseInt(req.params.id);
        const libroBuscado = libros.findIndex((a) => a.id == id);
        
        if(!libros[libroBuscado]){
            const error = new Error ('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        else{
            res.json(libros[libroBuscado]);
            libros.splice(libroBuscado, 1);
        }
    }catch(err){
        next(err);
    }
});

module.exports = routerLibros; 