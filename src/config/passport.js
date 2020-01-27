const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    console.log(user[0]);
    done(null, user[0].Id_Usuario);
});

 
passport.deserializeUser((id, done) => {
    
    pool.query(`SELECT * FROM  usuarios WHERE Id_Usuario = ${id}`, (err, user) => {
        console.log(user[0]);
        done(err,user[0])
    })

});

passport.use('local',new LocalStrategy({
    usernameField: 'userEmail',
}, async(email, password, done) => {
    
 
    // Match Email User
    const user = await pool.query(`SELECT * FROM  usuarios WHERE userEmail = '${email}'`, async (err,usuario) => {
        if(!usuario){
            return done(null,false, { mensaje: 'Este email no esta registrado' })
        } else if(usuario.length > 0){
            if(await bcrypt.compare(password, usuario[0].password))
                return done(null,usuario)
            else 
            return done(null,false, { mensaje: 'La contraseña no es correcta' })
        } else
            return done(null,false, { mensaje: 'Este email no esta registrado' })
    })
}))


 