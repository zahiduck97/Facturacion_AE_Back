const express = require('express');
const router = express.Router();
const pool = require('../database');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// Add Norm
router.post('/addNorm',   async(req,res) => {
    if(!req.body.nombre_Norma || !req.body.descripcion_Norma){ 
        manejoErrores(400,'El nombre y la descripcion son requeridos', res);
        return;
    }

    const norma = {
        Id_Norma: 0,
        nombre_Norma : req.body.nombre_Norma.toUpperCase(),
        descripcion_Norma : req.body.descripcion_Norma
    }

    const normadb = await pool.query(`INSERT INTO normas (nombre_Norma, descripcion_Norma) VALUES ('${norma.nombre_Norma}', '${norma.descripcion_Norma}')`).catch(e => { 
        manejoErrores(400,'Error al insertar la norma', res)
    });

    if(normadb){
        norma.Id_Norma = normadb.insertId;
        res.json(norma);
    }
        
});

// Get a Norm
router.get('/Norm/:id',   async(req,res) => {
    const id = req.params.id;

    const norma = await pool.query(`SELECT * FROM normas WHERE Id_Norma = ${id}`).catch( e => {
        manejoErrores(400,'Error al buscar la norma', res);
    })

    if(!norma) 
        return false;
    else if( norma.length > 0)
        res.json(norma[0]);
    else {
        manejoErrores(400,'La norma no existe', res);
    }
});

// Get All Norm
router.get('/Norms',  async(req,res)=>{
    const normas =  await pool.query('SELECT * FROM normas').catch(e => { 
        manejoErrores(400, 'Error al buscar las normas', res);
    })
    
    if(normas){
        res.json(normas);
    }
})

// Get All ORder
router.get('/NormsOrder',  async(req,res)=>{
    const normas =  await pool.query('SELECT * FROM normas ORDER BY Id_Norma DESC').catch(e => { 
        manejoErrores(400, 'Error al buscar las normas', res);
    })
    
    if(normas){
        res.json(normas);
    }
})

// Delete A Norm
router.delete('/Norm/:id',   async(req,res) => {
    const id = req.params.id;
    
    const normaSelect = await pool.query(`SELECT * FROM normas WHERE Id_Norma = ${id}`).catch(e => {
        manejoErrores(400,'Ocurrio un error', res);
    })
    
    if(!normaSelect){ return false; }
    else if(normaSelect.length == 0){
        manejoErrores(400, 'La norma no existe', res);
    } else {    
        const normadb = await pool.query(`DELETE FROM normas WHERE Id_Norma = ${id}`).catch(e => {
            manejoErrores(400,'Error al borrar la norma', res);
        })
        if(!normadb){ return false; }
        else {
            res.json(normaSelect[0]);
        }
    }

});

// Update a Norm
router.put('/Norm/:id',   async(req,res) => {
    const id = req.params.id;

    if(!req.body.nombre_Norma || !req.body.descripcion_Norma){ 
        manejoErrores(400,'El nombre y la descripcion son requeridos', res);
        return;
    }

    const norma = {
        Id_Norma: 0,
        nombre_Norma : req.body.nombre_Norma.toUpperCase(),
        descripcion_Norma : req.body.descripcion_Norma
    }
    
    const normaSelect = await pool.query(`SELECT * FROM normas WHERE Id_Norma = ${id}`).catch(e => {
        manejoErrores(400,'Ocurrio un error', res);
    })

    if(!normaSelect){ return false; }
    else if(normaSelect.length == 0){
        manejoErrores(400, 'La norma no existe', res);
    } else {
        
        const normadb = await pool.query(`UPDATE normas SET nombre_Norma ='${norma.nombre_Norma}', descripcion_Norma = '${norma.descripcion_Norma}' WHERE Id_Norma = ${id}`).catch(e => { 
            manejoErrores(400,'Error al actualizar la norma', res)
        });

        if(normadb){
            norma.Id_Norma = parseInt(id);
            res.json(norma);
        }
    }    

});

// get nombreNorma
router.get('/NormView/:id', async(req, res) => {
    const id = req.params.id;

    const normsel = await pool.query(`SELECT * FROM normas_form_view WHERE Id_Form = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar en la view', res);
        return false;
    })

    if(normsel.length == 0)
        manejoErrores(400, 'No existe la norma', res);
    else if(normsel.length){
        res.json(normsel[0])
    }
})

// Function
function manejoErrores(status, mensaje, res){
    res.status(status).json({
        mensaje
    });
}

module.exports = router;