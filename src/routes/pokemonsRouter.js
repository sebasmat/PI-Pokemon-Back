const express = require("express");
const pokemonsRouter = express.Router();
const createPokemon = require('../Controllers/createPokemon.js');
const getPokemonById = require('../Controllers/getPokemonById.js');
const getPokemons = require('../Controllers/getPokemons.js');

pokemonsRouter.get("/", async (req, res) => {
    try {
        const {name} = req.query;
        const users = name ? await getPokemons(name) : await getPokemons();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ error: "El pokemon no existe" });
    }
});

pokemonsRouter.post("/", async (req, res) => {
    try {
        const {name, image, life, attack, defense, speed, height, weight, type1, type2 } = req.body;
        if (!name || !image || !life || !attack || !defense || !type1 || !type2) {
            return res.status(400).json({ error: "Datos insuficientes" });
        }
        const newPokemon = await createPokemon({name, image, life, attack, defense, speed, height, weight }, {type1,type2});
        return res.status(201).json("Pokemon created successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


pokemonsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const source = isNaN(id) ? "DB" : "API";
    try {
        const pokemon = await getPokemonById(id,source);
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
module.exports = pokemonsRouter;