
const { API_KEY } = process.env;
const { Router } = require('express');
require('dotenv').config();
const axios = require('axios');
const {infoTotal, infoApi, nameApi, infoDB} = require('../controllers/index')
const { Videogame, Genre } = require('../db');

const router = Router();


/* router.get("/videogames", async (req, res) => {
    
    try {
  
        const { name } = req.query;
  
        let videogameAllName = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`);
  
        if (name) {
  
            let videogameName = videogameAllName.data.results.filter(data => data.name.toLowerCase().includes(name.toLowerCase()))
  
            videogameName = videogameName.slice(0, 15);
  
            videogameName = videogameName.map(data => {
                return {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    released: data.released,
                    rating: data.rating,
                    image: data.background_image,
                    platforms: data.platforms?.map(data => data.platform.name),
                    genres: data.genres?.map(data => data.name)
                }
            });
  
            let videogameDb = await Videogame.findAll({ //se busca todas las coincidencias en la DB donde coincida su nombre con lo que me pasan por body
                where: {
                    name: {
                        [Op.iLike]: "%" + name + "%"
                    },
                },
                include: Genre
            })
  
            videogameDb = videogameDb.map(({ id, name, released, rating, platforms, genres, image}) => ({
                id,
                name,
                released,
                rating,
                platforms,
                genres: genres.map((genre) => genre.name),
                image
            }));
  
            videogameName = videogameDb.concat(videogameName)
  
            if (videogameName.length) {
               return res.status(200).json(videogameName)
            } else {
               return res.json({err:"No existe ese videojuego"});
            }
        } else {
  
            let allVideogames = await allGamesInfo();
  
            res.status(200).json(allVideogames);
        }
  
    } catch (error) {
        console.log(error)
    }
  
  }); */
  


/*  router.get('/videogames', async (req, res) => {

    const name = req.query.name // ej: "/videogames?gta"
    let videogamesTotal = await getAllVideogames();

    //Si tengo un nombre que me pasan por query
    if (name) {
        let videogameName = await videogamesTotal.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
        videogameName.length ?
            res.status(200).send(videogameName) :
            res.status(404).send('No se encuentra el videojuego');
    } else {
        res.status(200).send(videogamesTotal)
    }
})  */
//router.get('/',infoTotal)

 router.get('/', async (req, res, next) => {
    const { name } = req.query; //el nombre me llega por query
    let allVideogames = await infoTotal()
  
    if(name) { 
        try { 
            const foundGamesAPI = await nameApi(name)
            const gamesByNameDB = await infoDB()
            let foundGamesDB =  gamesByNameDB.filter(el => 
                el.name.toLowerCase().includes(name.toLowerCase()))
            let allResults = foundGamesDB.concat(foundGamesAPI)
            allResults.length ? res.status(200).send(allResults.slice(0,15)) 
            : res.status(400).send('No hay un videojuego con dicho nombre')

        } catch(err) {
            next(err)
        }
    }
    else {
        res.send(allVideogames)
        //console.log(allVideogames)
        return
    }
    })

  router.get('/platforms', async (req, res, next) => {
        
    try {
        const all = await infoApi();
        const allPlatforms = [];
        all.map(g => g.platforms.map(p => {
            if(!allPlatforms.includes(p)) {
                allPlatforms.push(p)
            }
        }))
    
        allPlatforms.length ? res.status(200).json(allPlatforms) : res.status(404).send('Error')

        }catch(e) {
            next(e)
        }
    }) 
 








module.exports = router;