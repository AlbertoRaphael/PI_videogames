
const { API_KEY } = process.env;
const { Router } = require('express');
const { videogame } = require('../controllers/index')
const { Videogame, Genres } = require('../db.js')


const router = Router();
//get videogame detail by id

/* router.get('/videogames/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id.includes('-')) {
            let allVideogames = await getAllVideogames(); // me trae todo

            let idGame = await allVideogames.filter(e => e.id === parseInt(id));

            if (idGame.length > 0) {
                const detalle = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
                const description = detalle.data.description_raw;
                idGame[0]['description'] = description;
                res.status(200).send(idGame)
            }
        } else {
            let gameFound = await Videogame.findByPk(id, {
                include: [{
                    model: Genre,
                    attributes: ['name'],
                    through: {
                        attributes: [],
                    }
                }]
            })
            var arreglo = []
            arreglo.push(gameFound)

            res.status(200).json(arreglo)
        }
    } catch (error) {
        res.status(404).send(error)
    }


})

router.post('/videogame', async (req, res) => {
    let { name, description, released, rating, platforms, img, genre } = req.body

    if (!name || !description || !genre) {
        return res.status(400).send("Faltan parametros");
    }
    //valido que el nombre del juego no exista
    const findVideogame = await Videogame.findAll({
        where: { name: name }

    });
    if (findVideogame.length != 0) {
        return res.send("El nombre ya esta en uso");
    }


    //creo un videogame
    let vgCreate = await Videogame.create({
        name,
        description,
        rating,
        released,
        img,
        platforms: platforms.toString(),

    });
    //busco el genero en mi Base de datos
    let genreDb = await Genres.findAll({
        where: { name: genres },
    });

    //agrego el genero a mi videogame creado
    vgCreate.addGenre(genreDb);

    res.send("El Videogame fue creado con exito");

}) */



router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params //el id me llega por params
        let game = await videogame(id)


        if (!game) {
            return res.status(404).json({ msg: "Oops, this game does not exist" })
        }
        return res.json(game)
    } catch (error) {
        return next(error)
    }
}),


    

    router.post('/', async (req, res, next) => {
        let { name,
             image, 
             genres, 
             released, 
             rating, 
             platforms,
              description } = req.body
        //la accion de crear una nueva instancia es asincrona, como manejo errores? con try y catch
        try {
            let newVideogame = await Videogame.create({ //le paso al create el objeto con todos los atributos que quiero que tenga mi nuevo videojuego
                name,
                image,
                released,
                rating,
                platforms,
                description
            })
            let relacion = await Genres.findAll({ //en generos, buscame todos aquellos
                where: { //donde
                    name: genres
                }
            })
            await newVideogame.addGenres(relacion) //a mi juego creado, le agrego algun genero
            res.json(newVideogame)

        } catch (e) {
            next(e)
        }
    })




   




module.exports = router;