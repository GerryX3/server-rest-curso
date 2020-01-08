const express = require('express');
const _ = require('underscore');
let { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');



// ==============================
//  Mostrar todas las categorias
//===============================
app.get('/categoria', verificarToken, (req, res) => {
    //todas las categorias

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({ estado: true }, 'descripcion estado usuario')
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categorias,
                    conteo
                });
            })

        });

});



// ==============================
//  Mostrar todas las categorias
//===============================
app.get('/categoria/:id', verificarToken, (req, res) => {
    //Categoria.findById(...)
    let id = req.params.id;

    Categoria.findById(id, 'descripcion estado usuario')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }


            res.json({
                ok: true,
                categoria: categoriaDB
            });

        });
});


// ==============================
//  Crear nueva categoria
//===============================
app.post('/categoria', verificarToken, (req, res) => {
    //regresa la nueva categoria
    // req.usuario._id

    let body = _.pick(req.body, ['descripcion', 'estado']);


    let categoria = new Categoria({...body, usuario: req.usuario._id });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


// ==============================
//  Editar nueva categoria
//===============================
app.put('/categoria/:id', verificarToken, (req, res) => {

    let body = _.pick(req.body, ['descripcion', 'estado']);

    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


// ==============================
//  Eliminar nueva categoria
//===============================
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    // solo un administrador puede borrar
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, categoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        });
    });
});




module.exports = app;