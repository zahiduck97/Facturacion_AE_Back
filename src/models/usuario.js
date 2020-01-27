const passport = require('passport');
const pool = require('../database');
const bcrypt = require('bcryptjs');


exports.postLogin = async(req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', (err, usuario, info) => {
        if(err){
            next(err);
        }
        if(!usuario){
           return res.status(400).send('Email o contraseña no validos')
        }

        req.logIn(usuario, (err) => {
            if(err){
                next(err);
            }
            res.json({ mensaje: 'Login Exitoso' });
        })
    })(req,res,next);

    // const usuario = await pool.query(`SELECT * FROM  usuarios WHERE userEmail = '${req.body.userEmail}'`);
    
    // console.log(usuario[0]);
    // if(!usuario){
    //     return res.status(400).send('Este email no esta registrado');
    // } else if(usuario.length > 0){
    //     if(await bcrypt.compare(req.body.password, usuario[0].password)){
    //         var prueba = await encryptPassword(req.body.password);
    //         res.json({prueba})
    //     }
    //     else 
    //     return res.status(400).send('Contraseña incorrecta');
    // } else {
    //     return res.status(400).send('Este email no esta registrado');
    // }
}

exports.logout = (req, res) => {
    req.logout();
    res.json({mensaje:'Logout exitoso'});
}


async function encryptPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
}
