const express = require('express');
const router = express.Router();
const pool = require('../database');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


// Add Dictamen
router.post('/addDictamen', async(req, res) => {
    
    console.log(req.body);

    if(!req.body.pedimento || !req.body.factura || !req.body.lote  || !req.body.domicilio || !req.body.calle || !req.body.colonia || !req.body.municipio || !req.body.estado || !req.body.cp || !req.body.fecha || !req.body.nombre || !req.body.telefono){
        manejoErrores(400, 'Faltan Datos', res);
        return false;
    }
  

    
    const form = {
        Id_Dictamen: 0,
        anexos_dictamen: req.body.anexos_dictamen || '',
        pedimento:  req.body.pedimento,
        factura: req.body.factura.toUpperCase(),
        lote: req.body.lote,
        domicilio: req.body.domicilio,
        calle: req.body.calle.toUpperCase(),
        colonia: req.body.colonia.toUpperCase(),
        municipio: req.body.municipio.toUpperCase(),
        estado: req.body.estado.toUpperCase(),
        cp:  req.body.cp,
        nombre: req.body.nombre.toUpperCase(),
        telefono:  req.body.telefono,
        fecha: req.body.fecha
    }

    const formdb = await pool.query(`INSERT INTO dictamenes (anexos_dictamen, pedimento, factura, lote, domicilio, calle_verificacion, colonia_verificacion, municipio_verificacion, estado_verificacion, codigo_postal_verificacion, nombre_verificacion, telefono_verificacion, fecha_verificacion) VALUES('${form.anexos_dictamen}', '${form.pedimento}', '${form.factura}', '${form.lote}', '${form.domicilio}', '${form.calle}', '${form.colonia}', '${form.municipio}', '${form.estado}', '${form.cp}', '${form.nombre}', '${form.telefono}', '${form.fecha}')`).catch(e => {
        console.log(e);
        manejoErrores(400, 'Error al insertar el dictamen', res);
    })

    if(formdb){
        const Id = formdb.insertId;
        res.json(Id);
    }
})

// Get Dictamenes
router.get('/dictamenes', async(req, res )=>{
    const formdb = await pool.query(`SELECT * FROM dictamenes`).catch(e => {
        manejoErrores(400, 'Error al buscar los dictamenes', res);
    })

    if(formdb)
        res.json(formdb)
})

// Get 1 Dictamen
router.get('/dictamen/:id', async(req, res) => {
    const id = req.params.id;

    const dictamenSelect = await pool.query(`SELECT * FROM dictamenes WHERE Id_Dictamen = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el dictamen', res)
    })

    if(dictamenSelect.length == 0)
        manejoErrores(400, 'El dictamen no existe', res);
    else if(dictamenSelect.length > 0)
        res.json(dictamenSelect[0]);

})

// Update Form
router.put('/dictamen/:id', async (req, res ) => {
    const id = req.params.id;

    if(!req.body.pedimento || !req.body.factura || !req.body.lote  || !req.body.domicilio || !req.body.calle || !req.body.colonia || !req.body.municipio || !req.body.estado || !req.body.cp  || !req.body.nombre || !req.body.fecha || !req.body.telefono){
        manejoErrores(400, 'Faltan Datos', res);
        return false;
    }

    const formsel = await pool.query(`SELECT * FROM dictamenes WHERE Id_Dictamen = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el dictamen', res);
        return false;
    })

    if(formsel.length == 0)
        manejoErrores(400, 'El dictamen no existe', res);
    else {
        
        const form = {
            Id_Dictamen: 0,
            anexos_dictamen: req.body.anexos_dictamen || '',
            pedimento:  req.body.pedimento,
            factura: req.body.factura.toUpperCase(),
            lote: req.body.lote,
            domicilio: req.body.domicilio,
            calle: req.body.calle.toUpperCase(),
            colonia: req.body.colonia.toUpperCase(),
            municipio: req.body.municipio.toUpperCase(),
            estado: req.body.estado.toUpperCase(),
            cp:  req.body.cp,
            nombre: req.body.nombre.toUpperCase(),
            telefono:  req.body.telefono,
            fecha: req.body.fecha
        }

        const formdb = await pool.query(`UPDATE dictamenes SET anexos_dictamen = '${form.anexos_dictamen}', pedimento = '${form.pedimento}', factura = '${form.factura}', lote = '${form.lote}', domicilio = '${form.domicilio}', calle_verificacion = '${form.calle}', colonia_verificacion = '${form.colonia}', municipio_verificacion = '${form.municipio}', estado_verificacion = '${form.estado}', codigo_postal_verificacion = '${form.cp}', nombre_verificacion = '${form.nombre}', telefono_verificacion = '${form.telefono}', fecha_verificacion = '${form.fecha}'`).catch(e => {
            console.log(e);
            manejoErrores(400, 'Error al actualizar el dictamen', res);
        })


        if(formdb){
            res.json(parseInt(id));
        }
    }
})

// Delete form
router.delete('/dictamen/:id', async(req, res) => {
    const id = req.params.id;

    const formSel = await pool.query(`SELECT * FROM dictamenes WHERE Id_Dictamen = ${id}
    `).catch(e => {
        manejoErrores(400, 'Error al buscar el servicio', res);
        return false;
    })

    if(formSel.length == 0)
        manejoErrores(400, 'no existe el servicio', res);
    else if (formSel.length > 0){
        const formdb = await pool.query(`DELETE FROM dictamenes WHERE Id_Dictamen = ${id}`).catch(e => {
            manejoErrores(400, 'Error al borrar el registro', res);
            return false;
        })

        if(formdb)
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