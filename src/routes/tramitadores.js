const express = require('express');
const router = express.Router();
const pool = require('../database');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


// Searching for entermprise
router.get('/Tramitador-empresa/:id',  async(req,res) => {
    const id = req.params.id;

    const tramitadordb = await pool.query(`SELECT Id_Tramitador, nombre_Tramitador,email_tramitador, telefono_tramitador, facturar_a, razonSocial
    FROM tramitadores
    INNER JOIN empresas
    ON tramitadores.Id_Empresa = empresas.Id_Empresa WHERE tramitadores.Id_Empresa = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar los tramitadores', res);
    })

    if(!tramitadordb)
        return false;
    else if(tramitadordb.length == 0)
        manejoErrores(200, 'La empresa no existe',res);
    else    
        res.json(tramitadordb)
})

// making a inner join w/ enterprise
router.get('/TramitadoresInner',  async(req, res) => {
    const tramitadordb = await pool.query(`SELECT Id_Tramitador, nombre_tramitador,email_tramitador, telefono_tramitador, facturar_a, razonSocial, tramitadores.Id_Empresa
    FROM tramitadores
    INNER JOIN empresas
    ON tramitadores.Id_Empresa = empresas.Id_Empresa`).catch(e => {
        manejoErrores(400, 'Error al buscar los tramitadores', res);
    });

    if(tramitadordb)
        res.json(tramitadordb)
})

// making a inner join w/ enterprise Order
router.get('/TramitadoresInnerOrder',  async(req, res) => {
    const tramitadordb = await pool.query(`SELECT Id_Tramitador, nombre_tramitador,email_tramitador, telefono_tramitador, facturar_a, razonSocial, tramitadores.Id_Empresa
    FROM tramitadores
    INNER JOIN empresas
    ON tramitadores.Id_Empresa = empresas.Id_Empresa ORDER BY Id_Tramitador DESC`).catch(e => {
        manejoErrores(400, 'Error al buscar los tramitadores', res);
    });

    if(tramitadordb)
        res.json(tramitadordb)
})

// Add Tramitador
router.post('/addTramitador',  async(req, res) => {

    if( !req.body.nombre_tramitador || !req.body.email_tramitador || !req.body.telefono_tramitador || !req.body.facturar_a || !req.body.Id_Empresa){
        manejoErrores(400, 'Faltan datos', res);
        return false;
    }
    
    const tramitador = {
        Id_Tramitador: 0,
        nombre_tramitador: req.body.nombre_tramitador.toUpperCase(),
        email_tramitador: req.body.email_tramitador,
        telefono_tramitador: req.body.telefono_tramitador,
        facturar_a: req.body.facturar_a.toUpperCase(),
        Id_Empresa: req.body.Id_Empresa
    }

    const tramitadordb = await pool.query(`INSERT INTO tramitadores (nombre_tramitador, email_tramitador, telefono_tramitador, facturar_a, Id_Empresa) VALUES ('${tramitador.nombre_tramitador}', '${tramitador.email_tramitador}', '${tramitador.telefono_tramitador}', '${tramitador.facturar_a}', '${tramitador.Id_Empresa}' )`).catch(e => {
        manejoErrores(400, 'Error al insertar el tramitador', res);
    });

    if(tramitadordb){
        tramitador.Id_Tramitador = tramitadordb.insertId;
        res.json(tramitador);
    }

});

// Get a Tramitador
router.get('/Tramitador/:id',  async(req,res) => {
    const id = req.params.id;

    const tramitadordb = await pool.query(`SELECT * FROM tramitadores WHERE Id_Tramitador = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar tramitador', res);
    })

    if(!tramitadordb)
        return false;
    else if(tramitadordb.length == 0)
        manejoErrores(200, 'El Tramitador no existe', res);
    else 
        res.json(tramitadordb[0]);
});

// Get all Tramitadores
router.get('/Tramitadores',  async(req, res ) => {
    const tramitadordb = await pool.query(`SELECT * FROM tramitadores`).catch(e => {
        manejoErrores(400, 'Error al buscar los tramitadores', res);
    });

    if(tramitadordb)
        res.json(tramitadordb)
})

// Delete a Tramitador
router.delete('/Tramitador/:id',  async(req, res) => {
    const id = req.params.id;

    const tramitadorSelected = await pool.query(`SELECT * FROM tramitadores WHERE Id_Tramitador = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar en tramitadores', res);
    })

    if(!tramitadorSelected)
        return false;
    else if(tramitadorSelected.length == 0)
        manejoErrores(200, 'El tramitador no existe', res);
    else {
        const tramitadordb = await pool.query(`DELETE FROM tramitadores WHERE Id_Tramitador = ${id}`).catch(e => {
            manejoErrores(400, 'Error al borrar el tramitador', res);
        });

        if(tramitadordb)
            res.json(tramitadorSelected[0]);
    }
});

// Update a Tramitador
router.put('/Tramitador/:id',  async(req,res) => {
    const id = req.params.id;

    if( !req.body.nombre_tramitador || !req.body.email_tramitador || !req.body.telefono_tramitador || !req.body.facturar_a || !req.body.Id_Empresa){
        manejoErrores(400, 'Faltan datos', res);
        return false;
    }

    const tramitador = {
        Id_Tramitador: 0,
        nombre_tramitador: req.body.nombre_tramitador.toUpperCase(),
        email_tramitador: req.body.email_tramitador,
        telefono_tramitador: req.body.telefono_tramitador,
        facturar_a: req.body.facturar_a.toUpperCase(),
        Id_Empresa: req.body.Id_Empresa
    }

    const tramitadorSelected = await pool.query(`SELECT * FROM tramitadores WHERE Id_Tramitador = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar en tramitadores', res);
    })

    if(!tramitadorSelected)
        return false;
    else if(tramitadorSelected.length == 0)
        manejoErrores(200, 'El tramitador no existe', res);
    else {
        const tramitadordb = await pool.query(`UPDATE tramitadores SET nombre_tramitador = '${tramitador.nombre_tramitador}', email_tramitador = '${tramitador.email_tramitador}', telefono_tramitador = '${tramitador.telefono_tramitador}', facturar_a = '${tramitador.facturar_a}', Id_Empresa = '${tramitador.Id_Empresa}' WHERE Id_Tramitador = ${id} `).catch(e => {
            manejoErrores(400, 'Error al actualizar el tramitador', res);
        })

        if(tramitadordb){
            tramitador.Id_Tramitador = parseInt(id);
            res.json(tramitador);
        }
    }
});

// Functiones
function manejoErrores(status, mensaje, res){
    res.status(status).json({
        mensaje
    });
}

module.exports = router;