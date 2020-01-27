const express = require('express');
const router = express.Router();
const pool = require('../database');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


// Add Constancia
router.post('/addConstancia', async(req, res) => {

    

    if(!req.body.Id_Usuario || !req.body.Norma || !req.body.Servicio  || !req.body.nombre_producto || !req.body.marca_producto || !req.body.pais_producto || !req.body.modelo_producto || !req.body.presentacion_producto || !req.body.contenido_producto || (req.body.Servicio == 'D' && !req.body.Id_Dictamen)){
        manejoErrores(400, 'Faltan Datos', res);
        return false;
    }
    
    
    const form = {
        Id_Form: 0,
        Id_Dictamen: req.body.Id_Dictamen || '',
        Id_Usuario: req.body.Id_Usuario,
        Norma: req.body.Norma,
        Servicio: req.body.Servicio,
        anexos: req.body.anexos || '',
        nombre_producto: req.body.nombre_producto.toUpperCase(),
        marca_producto: req.body.marca_producto.toUpperCase(),
        pais_producto: req.body.pais_producto.toUpperCase(),
        modelo_producto: req.body.modelo_producto.toUpperCase(),
        presentacion_producto: req.body.presentacion_producto.toUpperCase(),
        contenido_producto: req.body.contenido_producto.toUpperCase()
    }

    var formdb;

    if(form.Id_Dictamen == ''){
        formdb = await pool.query(`INSERT INTO forms (Id_Usuario, Norma, Servicio, anexos, nombre_producto, marca_producto, pais_producto, modelo_producto, presentacion_producto, contenido_producto) VALUES('${form.Id_Usuario}', '${form.Norma}', '${form.Servicio}', '${form.anexos}', '${form.nombre_producto}', '${form.marca_producto}', '${form.pais_producto}', '${form.modelo_producto}', '${form.presentacion_producto}', '${form.contenido_producto}')`).catch(e => {
            console.log(e);
            manejoErrores(400, 'Error al insertar la constancia', res);
        })
    } else {

        formdb = await pool.query(`INSERT INTO forms (Id_Usuario, Norma, Servicio, anexos, nombre_producto, marca_producto, pais_producto, modelo_producto, presentacion_producto, contenido_producto, Id_Dictamen) VALUES('${form.Id_Usuario}', '${form.Norma}', '${form.Servicio}', '${form.anexos}', '${form.nombre_producto}', '${form.marca_producto}', '${form.pais_producto}', '${form.modelo_producto}', '${form.presentacion_producto}', '${form.contenido_producto}', '${form.Id_Dictamen}')`).catch(e => {
            console.log(e);
            manejoErrores(400, 'Error al insertar la constancia', res);
        })
    }
    

    if(formdb){
        const Id = formdb.insertId;
        res.json(Id);
    }

});

// Get from the view for the pdf
router.get('/forms', async(req, res) => {
    const formsdb = await pool.query('SELECT * FROM form_service_view ORDER BY Id_Form DESC').catch( e => {
        manejoErrores(400, 'Error al buscar en la vista', res)
    })

    if(formsdb)
        res.json(formsdb);
})

// Get forms
router.get('/allForms', async(req, res) => {
    const formdb = await pool.query('SELECT * FROM forms ORDER BY Id_Form DESC').catch(e => {
        console.log(e);
        manejoErrores(400, 'Error al buscar los forms', res);
        return false;
    })

    if(formdb)
        res.json(formdb);
})

// Get 1 Form
router.get('/Forms/:id', async(req, res) => {
    const id = req.params.id;

    const formdb = await pool.query(`SELECT * FROM forms WHERE Id_Form = ${id}`).catch(e => {
        console.log(e);
        manejoErrores(400, 'Error al buscar el form', res);
        return false;
    })

    if(formdb.length == 0)
        manejoErrores(400, 'No existe el form', res);
    else if(formdb.length > 0)
        res.json(formdb[0]);
})

// Get forms from 1 client
router.get('/FormsClient/:id', async(req, res) => {
    const id = req.params.id;

    const formdb = await pool.query(`SELECT * FROM test.form_service_view WHERE Id_Usuario = ${id} ORDER BY Id_Form DESC`).catch(e => {
        manejoErrores(400, 'Error al buscar los forms', res);
        return false;
    })

    if(formdb.length == 0)
        manejoErrores(400, 'No existe ningun formulario', res);
    else{
        res.json(formdb);
    }
})

// Put constancia
router.put('/Form/:id', async(req, res) => {
    console.log(req.body);
    const id = req.params.id;

    if(!req.body.Id_Usuario || !req.body.Norma || !req.body.Servicio  || !req.body.nombre_producto || !req.body.marca_producto || !req.body.pais_producto || !req.body.modelo_producto || !req.body.presentacion_producto || !req.body.contenido_producto || (req.body.Servicio == 'D' && !req.body.Id_Dictamen)){
        manejoErrores(400, 'Faltan Datos', res);
        return false;
    }

    const formSel = await pool.query(`SELECT * FROM forms WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el form', res);
        return false;
    })
    
    if(formSel.length == 0)
        manejoErrores(400, 'No existe el form', res);
    else if(formSel.length > 0){
        
        const form = {
            Id_Form: 0,
            Id_Dictamen: req.body.Id_Dictamen || '',
            Id_Usuario: req.body.Id_Usuario,
            Norma: req.body.Norma,
            Servicio: req.body.Servicio,
            anexos: req.body.anexos || '',
            nombre_producto: req.body.nombre_producto.toUpperCase(),
            marca_producto: req.body.marca_producto.toUpperCase(),
            pais_producto: req.body.pais_producto.toUpperCase(),
            modelo_producto: req.body.modelo_producto.toUpperCase(),
            presentacion_producto: req.body.presentacion_producto.toUpperCase(),
            contenido_producto: req.body.contenido_producto.toUpperCase()
        }

        var formdb;

        if(form.Servicio == 'C'){
            formdb = await pool.query(`update forms set Id_Usuario = '${form.Id_Usuario}', Norma = '${form.Norma}', Servicio = '${form.Servicio}', anexos = '${form.anexos}', nombre_producto = '${form.nombre_producto}', marca_producto = '${form.marca_producto}', pais_producto = '${form.pais_producto}', modelo_producto = '${form.modelo_producto}', presentacion_producto = '${form.presentacion_producto}', contenido_producto = '${form.contenido_producto}', Id_Dictamen = null WHERE Id_Form = ${id}`).catch(e => {
                console.log(e);
                manejoErrores(400, 'Error al actualizar la constancia', res);
            })
        } else {

            formdb = await pool.query(`update forms set Id_Dictamen = '${form.Id_Dictamen}', Id_Usuario = '${form.Id_Usuario}', Norma = '${form.Norma}', Servicio = '${form.Servicio}', anexos = '${form.anexos}', nombre_producto = '${form.nombre_producto}', marca_producto = '${form.marca_producto}', pais_producto = '${form.pais_producto}', modelo_producto = '${form.modelo_producto}', presentacion_producto = '${form.presentacion_producto}', contenido_producto = '${form.contenido_producto}', Id_Dictamen = '${form.Id_Dictamen}' WHERE Id_Form = ${id}`).catch(e => {
                console.log(e);
                manejoErrores(400, 'Error al actualizar el dictamen', res);
            })

    
        }
        

        if(formdb){
            res.json(parseInt(id));
        }           
    }
})

// Delete constancia
router.delete('/Form/:id', async(req, res) => {
    const id = req.params.id;

    const formSel = await pool.query(`SELECT * FROM forms WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el formulario', res);
        return false;
    })

    if(formSel.length = 0){
        manejoErrores(400, 'No existe el formulario', res);
    } else {
        const formDb = await pool.query(`DELETE FROM forms WHERE Id_Form = ${id}`).catch(e => {
            manejoErrores(400, 'Error al eliminar formulario', res);
            return false;
        })

        if(formDb)
            res.json('ok');
    }
})





// Functions
function manejoErrores(status, mensaje, res){
    res.status(status).json({
        mensaje
    });
}

module.exports = router;