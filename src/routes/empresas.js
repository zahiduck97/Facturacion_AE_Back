const express = require('express');
const router = express.Router();
const pool = require('../database');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// Add Enterprise
router.post('/addEmpresa',  async(req, res) => {

    if(!req.body.razonSocial || !req.body.numeroContrato || !req.body.rfc || !req.body.email ||!req.body.telefono || !req.body.calle || !req.body.colonia || !req.body.municipio || !req.body.estado || !req.body.codigo_postal || !req.body.representante  ){
        manejoErrores(400, 'Faltan Datos', res);
        return ;
    }

    const empresa = {
        Id_empresa : 0,
        razonSocial: req.body.razonSocial.toUpperCase(),
        numeroContrato: req.body.numeroContrato.toUpperCase(),
        rfc: req.body.rfc.toUpperCase(),
        email: req.body.email,
        telefono: req.body.telefono,
        calle: req.body.calle.toUpperCase(),
        colonia: req.body.colonia.toUpperCase(),
        municipio: req.body.municipio.toUpperCase(),
        estado: req.body.estado.toUpperCase(),
        codigo_postal: req.body.codigo_postal,
        representante: req.body.representante.toUpperCase(),
    }


    const empresadb = await pool.query(`INSERT INTO empresas (razonSocial, numeroContrato, rfc, email, telefono, calle, colonia, municipio, estado, codigo_postal, representante) VALUES ('${empresa.razonSocial}', '${empresa.numeroContrato}', '${empresa.rfc}', '${empresa.email}', '${empresa.telefono}', '${empresa.calle}', '${empresa.colonia}', '${empresa.municipio}', '${empresa.estado}', '${empresa.codigo_postal}', '${empresa.representante}')`).catch(e => {
        manejoErrores(400, 'Error al insertar la empresa', res);
    });

    if(empresadb){
        empresa.Id_empresa = empresadb.insertId;
        res.json(empresa);
    }

});

// Get a Enterprise
router.get('/Empresa/:id',  async(req, res) => {
    const id = req.params.id;

    const empresadb = await pool.query(`SELECT * FROM empresas WHERE Id_Empresa = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar empleado',res);
    })

    if(!empresadb)
        return false;
    else if(empresadb.length == 0)
        manejoErrores(200, 'La empresa no existe', res);
    else
        res.json(empresadb[0]);
})

// Get all Enterprises
router.get('/Empresas', async(req, res) => {
    const empresas = await pool.query('SELECT * FROM empresas').catch(e => {
        manejoErrores(400, 'Error al buscar las empresas', res);
    })

    if(empresas)
        res.json(empresas);
});

// Get all Enterprises ORder
router.get('/EmpresasOrder', async(req, res) => {
    const empresas = await pool.query('SELECT * FROM empresas ORDER BY Id_Empresa DESC').catch(e => {
        manejoErrores(400, 'Error al buscar las empresas', res);
    })

    if(empresas)
        res.json(empresas);
});

// Delete a Enterprise
router.delete('/Empresa/:id',  async(req,res) => {
    const id = req.params.id;

    const empresaSelect = await pool.query(`SELECT * FROM empresas WHERE Id_Empresa = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar la empresa', res);
    })

    if(!empresaSelect)
        return false;
    else if(empresaSelect.length == 0)
        manejoErrores(400, 'No existe la empresa',res);
    else {
        const empresadb = await pool.query(` DELETE FROM empresas WHERE Id_Empresa = ${id}`).catch(e => {
            manejoErrores(400, 'Error al borrar la empresa',res);
        })

        if(empresadb)
            res.json(empresaSelect[0]);
    }

});

// Update a Enterprise
router.put('/Empresa/:id',  async(req, res) => {
    const id = req.params.id;

    if(!req.body.razonSocial || !req.body.numeroContrato || !req.body.rfc || !req.body.email ||!req.body.telefono || !req.body.calle || !req.body.colonia || !req.body.municipio || !req.body.estado || !req.body.codigo_postal || !req.body.representante ){
        manejoErrores(400, 'Faltan Datos', res);
        return ;
    }

    const empresa = {
        Id_empresa : 0,
        razonSocial: req.body.razonSocial.toUpperCase(),
        numeroContrato: req.body.numeroContrato.toUpperCase(),
        rfc: req.body.rfc.toUpperCase(),
        email: req.body.email,
        telefono: req.body.telefono,
        calle: req.body.calle.toUpperCase(),
        colonia: req.body.colonia.toUpperCase(),
        municipio: req.body.municipio.toUpperCase(),
        estado: req.body.estado.toUpperCase(),
        codigo_postal: req.body.codigo_postal,
        representante: req.body.representante.toUpperCase(),
    }

    const empresaSelect = await pool.query(`SELECT * FROM empresas WHERE Id_Empresa = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar empleado',res);
    })   
    
    if(!empresaSelect)
        return false
    else if(empresaSelect.length == 0) 
        manejoErrores(200, 'La empresa no existe', res);
    else {
        const empresadb = await pool.query(`UPDATE empresas SET razonSocial = '${empresa.razonSocial}', numeroContrato = '${empresa.numeroContrato}', rfc = '${empresa.rfc}', email = '${empresa.email}', telefono = '${empresa.telefono}', calle = '${empresa.calle}', colonia = '${empresa.colonia}', municipio = '${empresa.municipio}', estado = '${empresa.estado}', codigo_postal = '${empresa.codigo_postal}', representante = '${empresa.representante}' WHERE Id_Empresa = ${id} `).catch(e => {
            manejoErrores(400, 'Error al actualizar la empresa', res);
        });

        if(empresadb){
            empresa.Id_empresa = parseInt(id);
            res.json(empresa);
        }
    }
});

// Functions
function manejoErrores(status, mensaje, res){
    res.status(status).json({
        mensaje
    })
}

module.exports = router;