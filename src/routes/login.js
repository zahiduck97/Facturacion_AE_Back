const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');

const controladorUsuario = require('../models/usuario');
const passportConfig = require('../config/passport');

// Helpers
const { isAuthenticated } = require('../helpers/auth');


router.post('/', controladorUsuario.postLogin);

router.get('/logout', controladorUsuario.logout);

router.get('/usuarioInfo', isAuthenticated, (req, res) => {
    res.json(req.user);
})

router.get('/pruebaConexion', isAuthenticated, (req, res) => {
    res.json({ mensaje: 'Estas Conectado :D' });
})

module.exports = router;
