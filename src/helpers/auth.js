const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Deber iniciar sesion primero!')
};


module.exports = helpers;