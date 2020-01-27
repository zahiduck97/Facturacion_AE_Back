const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcryptjs');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// Add User
router.post('/addUser',  async(req, res) => {
    if(!req.body.userEmail || !req.body.password || !req.body.rol || (!req.body.Id_Tramitador && !req.body.Id_Empleado) || (req.body.rol == 'T' && !req.body.Id_Tramitador) || (req.body.rol == 'E' && !req.body.Id_Empleado)){
        manejoErrores(400, 'Faltan datos', res);
        return false;
    }
    
    const user = {
        Id_Usuario: 0,
        Id_Tramitador: req.body.Id_Tramitador,
        Id_Empleado: req.body.Id_Empleado,
        userEmail: req.body.userEmail,
        password: await encryptPassword(req.body.password),
        rol: req.body.rol
    }


    var usuariodb;

    if(user.rol == 'E' || user.rol == 'A'){
        usuariodb = await pool.query(`INSERT INTO usuarios (Id_Empleado, userEmail, password, rol) VALUES ('${user.Id_Empleado}', '${user.userEmail}', '${user.password}', '${user.rol}')`).catch(e => {
            manejoErrores(400, 'Error al insertar el usuario', res);
        })
    } else {
        usuariodb = await pool.query(`INSERT INTO usuarios (Id_Tramitador, userEmail, password, rol) VALUES ('${user.Id_Tramitador}', '${user.userEmail}', '${user.password}', '${user.rol}')`).catch(e => {
            manejoErrores(400, 'Error al insertar el usuario', res);
        })
    }

    

    if(usuariodb){
        user.Id_Usuario = usuariodb.insertId;
        res.json(user);
    }
});

// Get a User
router.get('/User/:id',  async(req, res) => {
    const id = req.params.id;

    const userSelected = await pool.query(`SELECT * FROM usuarios WHERE Id_Usuario = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el usuario', res);
    })

    if(!userSelected)
        return false;
    else if(userSelected.length == 0)
        manejoErrores(200, 'El usuario no existe', res);
    else 
        res.json(userSelected[0]);
});

// Get all Users
router.get('/Users',  async(req, res) => {
    const usuariodb = await pool.query(`SELECT Id_Empleado,Id_Usuario, nombre_Empleado, rol, userEmail FROM usuarios`).catch(e => {
        manejoErrores(400, 'Error al buscar los usuarios', res);
    })

    if(usuariodb)
        res.json(usuariodb)
})

// Get all Tramitadores USer
router.get('/UsersTramitadores', async(req, res) => {
    const usuariodb = await pool.query(`SELECT Id_Usuario, tramitadores.Id_Tramitador, nombre_Tramitador, userEmail, rol FROM usuarios INNER JOIN tramitadores ON usuarios.Id_Tramitador = tramitadores.Id_Tramitador WHERE rol = 'T' ORDER BY Id_Usuario DESC `).catch(e => {
        manejoErrores(400, 'Error al buscar los usuarios', res);
    })

    if(usuariodb)
        res.json(usuariodb)
})

// Get one Tramitadores USer
router.get('/UsersTramitadores/:id', async(req, res) => {
    const id = req.params.id;

    const usuariodb = await pool.query(`SELECT Id_Usuario, tramitadores.Id_Tramitador, nombre_Tramitador, userEmail, rol FROM usuarios INNER JOIN tramitadores ON usuarios.Id_Tramitador = tramitadores.Id_Tramitador WHERE rol = 'T' AND Id_Usuario = ${id} `).catch(e => {
        manejoErrores(400, 'Error al buscar el usuario', res);
    })

    if(usuariodb.length == 0)
        manejoErrores(400, 'No existe ningun usuario', res);
    else
        res.json(usuariodb[0]);
})

// Put a Password
router.put('/User-password/:id',  async (req, res) => {
    console.log(req.body);
    const id = req.params.id;

    if(!req.body.password){
        manejoErrores(400, 'Faltan datos', res);
        return false;
    }

    const user = {
        Id_Usuario: 0,
        password: await encryptPassword(req.body.password),
    }

    const userSelected = await pool.query(`SELECT * FROM usuarios WHERE Id_Usuario = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el usuario', res);
    })

    if(!userSelected)
        return false;
    else if(userSelected.length == 0)
        manejoErrores(200, 'El usuario no existe', res);
    else {
        var usuariodb;

        usuariodb = await pool.query(`UPDATE usuarios SET password = '${user.password}' WHERE Id_Usuario = ${id} `).catch(e => {
                manejoErrores(400, 'Error al actualizar el usuario', res);
            })

        if(usuariodb){
            user.Id_Usuario = parseInt(id);
            res.json(user);
        }
    }
})

// Get all Empleados User
router.get('/UsersEmpleados',  async(req, res) => {
    const usuariodb = await pool.query(`SELECT Id_Usuario, empleados.Id_Empleado, nombre_Empleado, userEmail, rol FROM usuarios INNER JOIN empleados ON usuarios.Id_Empleado = empleados.Id_Empleado WHERE rol = 'E' ORDER BY Id_Usuario DESC`).catch(e => {
        manejoErrores(400, 'Error al buscar los usuarios', res);
    })

    if(usuariodb)
        res.json(usuariodb)
})

// Delete a user
router.delete('/User/:id',  async(req, res) => {
    const id = req.params.id;

    const userSelected = await pool.query(`SELECT * FROM usuarios WHERE Id_Usuario = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el usuario', res);
    })

    if(!userSelected)
        return false;
    else if(userSelected.length == 0)
        manejoErrores(200, 'El usuario no existe', res);
    else {
        const usuariodb = await pool.query(`DELETE FROM usuarios WHERE Id_Usuario = ${id}`).catch(e => {
            manejoErrores(400, 'Error al borrar el usuario', res);
        })

        if(usuariodb)
            res.json(userSelected[0]);
    }
});


// Update a user
router.put('/User/:id',  async(req, res) => {
    const id = req.params.id;

    if(!req.body.userEmail || !req.body.rol || (!req.body.Id_Tramitador && !req.body.Id_Empleado) || (req.body.rol == 'T' && !req.body.Id_Tramitador) || (req.body.rol == 'E' && !req.body.Id_Empleado)){
        manejoErrores(400, 'Faltan datos', res);
        return false;
    }

    const user = {
        Id_Usuario: 0,
        Id_Tramitador: req.body.Id_Tramitador,
        Id_Empleado: req.body.Id_Empleado,
        userEmail: req.body.userEmail,
        password: req.body.password,
        rol: req.body.rol
    }

    const userSelected = await pool.query(`SELECT * FROM usuarios WHERE Id_Usuario = ${id}`).catch(e => {
        manejoErrores(400, 'Error al buscar el usuario', res);
    })

    if(!userSelected)
        return false;
    else if(userSelected.length == 0)
        manejoErrores(200, 'El usuario no existe', res);
    else {
        var usuariodb;

        if(user.rol == 'E' || user.rol == 'A'){
            usuariodb = await pool.query(`UPDATE usuarios SET Id_Empleado = '${user.Id_Empleado}', userEmail = '${user.userEmail}', password = '${user.password}', rol = '${user.rol}'  WHERE Id_Usuario = ${id} `).catch(e => {
                manejoErrores(400, 'Error al actualizar el usuario', res);
            })
        } else {
            usuariodb = await pool.query(`UPDATE usuarios SET Id_Tramitador = '${user.Id_Tramitador}', userEmail = '${user.userEmail}', password = '${user.password}', rol = '${user.rol}' WHERE Id_Usuario = ${id}`).catch(e => {
                manejoErrores(400, 'Error al actualizar el usuario', res);
            })
        }

        if(usuariodb){
            user.Id_Usuario = parseInt(id);
            res.json(user);
        }
    }

});

// Functions
function manejoErrores(status, mensaje, res){
    res.status(status).json({
        mensaje
    })
}

async function encryptPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
}

module.exports = router;