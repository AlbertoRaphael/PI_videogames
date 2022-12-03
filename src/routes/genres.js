const { Router } = require('express');
const router = Router();
const {Genres} = require('../db');
const { API_KEY } = process.env;
const axios = require('axios');

//Route to get genders and save in my db
/* router.get('/genres', async (req,res) => {
    const genresApi = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
    const genres = await genresApi.data.results.map(e => e.name)
 
    

    genres.forEach(e => Genres.findOrCreate({ //lo uso para guardar los generos que me traje de la API en la base de datos
        where: {name: e} //
    }))

    const allGenres = await Genres.findAll() //me traigo todos los generos que guarde en mi db
    res.json(allGenres)
}) */

/* router.get('/', async (req,res) => {
    //console.log(diets);
        try {
          const genero = await Genre.findAll()
          res.send(genero)  
        } catch (e) {
            res.status(404).send(e)
        }
}) */

router.get('/', async (req, res, next) => {
    try {
        const respuesta = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
        const genresApi = await respuesta.data.results.map(g => g.name)
        //console.log('estos son los generos: ', genresApi)

        genresApi.map(e => Genres.findOrCreate({ //lo uso para guardar los generos que me traje de la API en la base de datos
            where: {name: e} //
        }))

        const allGenres = await Genres.findAll() //me traigo todos los generos que guarde en mi db
        res.json(allGenres)

    }catch(e) {
        next(e)
    }

})
module.exports = router;