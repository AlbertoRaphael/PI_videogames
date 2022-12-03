const { Router } = require('express');
// Importar todos los routers;
const videogames = require('../routes/videogames');
const videogame = require('./videogame');
const genres = require('./genres');
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

//Configuro todos los routers
router.use('/videogames', videogames);
router.use('/genres', genres);
router.use('/videogame', videogame);

module.exports = router;
