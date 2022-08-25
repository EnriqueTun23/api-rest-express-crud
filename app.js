// const express = require('express');
// const Joi = require('joi');

import Joi from 'joi';
import express from 'express'
import morgan from 'morgan';
import config from 'config';
import Debug from 'debug';

const debug = Debug('app:inicio');



import { existeUsuario, validationUser } from './validations.js';
import { log } from './logger.js';

const app = express();

app.use(express.json()); //body
app.use(express.urlencoded({extended:true})); // Para parsiar el codigo
app.use(express.static('public'));

// Configuracion de entornos
console.log('Aplicacion:  ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

// uso de un midleware de terceros

if(app.get('env') == 'development') {
    app.use(morgan('tiny'));
    // console.log('Morgan habilitado');
    debug('Morgan habilitado')
    app.use(log)
}


app.use(function (req, res, next) {
    console.log('demo...');

    next();
})


const usuarios = [
    {id: 1, nombre: 'Enrique'},
    {id: 2, nombre: 'Pablo'},
    {id: 3, nombre: 'Ana'}
]


app.get('/', (req, res) => {
    res.send('Hola mundo');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios)
});

app.get('/api/usuarios/:year/:mes', (req, res) => {
    // res.send(req.params)
    res.send(req.query)
});

app.get('/api/usuarios/:id', (req, res) => {
    // let usuario = usuarios.find(u => u.id === parseInt(req.params.id))
    let usuario = existeUsuario(usuarios, req.params.id)

    if(!usuario)  res.status(404).send('El usuario no fue encontrado')
    res.send(usuario)

})


app.post('/api/usuarios', (req, res) => {

    const { status, data } = validationUser(usuarios, req.body)

    if (!status) { 
        res.status(400).send(data)
    } else {
        usuarios.push(data)
        res.send(data)

    }
    // const schema = Joi.object({
    //     nombre: Joi.string()
    //         .min(3)
    //         .required()
    // })

    // const { error, value } = schema.validate(req.body)

    // if (!error) {
    //     const usuario = {
    //         id: usuarios.length + 1,
    //         nombre: value.nombre
    //     };
    //     usuarios.push(usuario)

    //     res.send(usuario)
    // } else {
    //     const mensaje =  error.details[0].message
    //     res.status(400).send(mensaje)
    // }
    // if (!req.body.nombre || req.body.nombre.length <= 2) {
    //     // 400 Bad request
    //     res.status(400).send('Debe ingresar un nombre, que tenga minimo 3 letras');
    //     return;
    // }

    
});


app.put('/api/usuarios/:id', (req, res) => {
    // Encontrar si existe ele objeto usuario
    // let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(usuarios, req.params.id)

    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
})

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(usuarios, req.params.id)

    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);

    usuarios.splice(index, 1);
    res.send(usuarios);
});

const port  = process.env.PORT || 3005;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})