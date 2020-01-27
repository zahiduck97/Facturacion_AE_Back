const express = require('express');
const router = express.Router();
const pool = require('../database');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// Add Employee
router.post('/addEmpleado',  async(req,res) => {
    if(!req.body.nombre_Empleado || !req.body.iniciales){
        manejoErrores(400, 'El nombre y las iniciales son requeridas', res);
        return false;
    }
    
    const empleado = {
        Id_Empleado : 0,
        nombre_Empleado : req.body.nombre_Empleado.toUpperCase(),
        iniciales : req.body.iniciales.toUpperCase()
    }

    const empleadodb = await pool.query(`INSERT INTO empleados (nombre_Empleado, iniciales) VALUES ('${empleado.nombre_Empleado}', '${empleado.iniciales}')`).catch(e => {
        manejoErrores(400, 'Error al insertar en empleados', res);
    })

    if(empleadodb){ 
        empleado.Id_Empleado = empleadodb.insertId;
        res.json(empleado);
    }
});

// Get a Employee
router.get('/Empleado/:id',  async(req,res) => {
    const id = req.params.id;

    const empleadodb = await pool.query(`SELECT * FROM  empleados WHERE Id_Empleado = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el empleado', res);
    });

    if(!empleadodb)
        return false;
    else if( empleadodb.length > 0)
        res.json(empleadodb[0]);
    else 
        manejoErrores(400, 'El empleado no existe', res);
});

// Get All Employees
router.get('/Empleados',  async(req, res) => {
    const empleados = await pool.query('SELECT * FROM empleados').catch(e => {
        manejoErrores(400, 'Error al buscar empleados', res);
    });

    if(empleados){
        res.json(empleados);
    }
});

// Get All Employees
router.get('/EmpleadosOrder',  async(req, res) => {
    const empleados = await pool.query('SELECT * FROM empleados ORDER BY Id_Empleado DESC').catch(e => {
        manejoErrores(400, 'Error al buscar empleados', res);
    });

    if(empleados){
        res.json(empleados);
    }
});

// Delete a Employee
router.delete('/Empleado/:id',  async(req, res) => {
    const id = req.params.id;
    
    const empleadoSelect = await pool.query(`SELECT * FROM empleados WHERE Id_Empleado = ${id}`).catch(e => {
        manejoErrores(400,'Error al buscar el empleado', res);
    })
    
    if(!empleadoSelect){ return false; }
    else if(empleadoSelect.length == 0){
        manejoErrores(400, 'El empleado no existe', res);
    } else {    
        const empleadodb = await pool.query(`DELETE FROM empleados WHERE Id_Empleado = ${id}`).catch(e => {
            manejoErrores(400,'Error al borrar el empleado', res);
        })
        
        if(empleadodb)
            res.json(empleadoSelect[0]);
        
    }
});

// Update a Employee
router.put('/Empleado/:id',  async(req, res) => {
    const id = req.params.id;

    if(!req.body.nombre_Empleado || !req.body.iniciales){
        manejoErrores(400, 'El nombre y las iniciales son requeridas', res);
        return false;
    }

    const empleado = {
        Id_Empleado: 0,
        nombre_Empleado: req.body.nombre_Empleado,
        iniciales: req.body.iniciales
    }

    const empleadoSelect = await pool.query(`SELECT * FROM empleados WHERE Id_Empleado = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el empleado', res);
    })

    if(!empleadoSelect)
        return false
    else if(empleadoSelect.length == 0) 
        manejoErrores(400, 'El empleado no existe', res);
    else {
        const empleadodb = await pool.query(`UPDATE empleados SET nombre_Empleado = '${empleado.nombre_Empleado}', iniciales = '${empleado.iniciales}' WHERE Id_Empleado = ${id} `).catch(e => {
            manejoErrores(400, 'Error al actualizar el empleado', res);
        });

        if(empleadodb){
            empleado.Id_Empleado = parseInt(id);
            res.json(empleado);
        }
    }
});

// Function
function manejoErrores(status, mensaje, res){
    res.status(status).json({
        mensaje
    });
}

module.exports = router;