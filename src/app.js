// Requires
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
//const history = require('connect-history-api-fallback');
const mysql = require('mysql');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');


// Initializations
const app = express();



// Settings
const puerto = process.env.PORT || 3000;
app.set('port', puerto);


// Middlewares
app.use(morgan('tiny'));
app.use(cors());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Services
app.use((req, res, next) => {
  res.locals.html = path.join( __dirname, 'html' );
  next();
})


// Routes
app.use('/api',require('./routes/empresas'));
app.use('/api',require('./routes/tramitadores'));
app.use('/api',require('./routes/usuarios'));
app.use('/api',require('./routes/forms'));
app.use('/api',require('./routes/normas'));
app.use('/api',require('./routes/empleados'));
app.use('/api',require('./routes/login'));
app.use('/api',require('./routes/servicios'));
app.use('/api',require('./routes/dictamenes'));
app.use('/api',require('./routes/facturas'));


// STATIC  FIELDS
app.use(express.static(path.join(__dirname, 'public')));

// SERVER LISTING ON
app.listen(app.get('port'), ()=>{
    console.log('Server on port: ',app.get('port'));
});
