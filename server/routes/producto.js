const express = require('express');
const _ = require('underscore');
let { verificarToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

let Categoria = require('../models/categoria');



// ==============================
//  Obtener produtos
//===============================
app.get('/producto', verificarToken, (req, res) => {
    // trae todos los productos
    // populate: usuario cateogria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });

        });

});


// ==============================
//  Obtener  un produto por ID
//===============================
app.get('/producto/:id', verificarToken, (req, res) => {
    // populate: usuario cateogria
    // paginado
    const id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ==============================
//  Buscar producto
//===============================
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {


    const termino = req.params.termino;

    const regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });


        });

});


// ==============================
//  Guardar un nuevo produto
//===============================
app.post('/producto', verificarToken, (req, res) => {
    // grabar usuario
    // grabar categoria del listado

    const body = {...req.body, usuario: req.usuario._id }


    Categoria.findById(body.categoria, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Categoria no encontrada' }
            });
        }


        let producto = new Producto(body);

        producto.save((err, productoDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.status(201).json({
                ok: true,
                producto: productoDB
            });

        });

    });


});


// ==============================
//  Actualizar un nuevo produto
//===============================
app.put('/producto/:id', verificarToken, (req, res) => {
    // grabar usuario
    // grabar categoria del listado
    const body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    const id = req.params.id;

    Categoria.findById(body.categoria, (err, categoriaDB) => {

        if (body.categoria && err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (body.categoria && !categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Categoria no encontrada' }
            });
        }

        Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

    });
});


// ==============================
//  Borrar un nuevo produto
//===============================
app.delete('/producto/:id', verificarToken, (req, res) => {
    // borrado logico

    const id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


module.exports = app;