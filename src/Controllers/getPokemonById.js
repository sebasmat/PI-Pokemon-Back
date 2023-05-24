const { Pokemon, Types } = require('../db.js');
const axios = require("axios");
const getPokemonById = async (id, source) => {
    const pokemon =
        source === "DB"
            ? await Pokemon.findByPk(id,{include:[
                {
                    model:Types,
                    as: "types",
                    attributes:['name'],
                    through:{
                        attributes:[]
                    } 
                }
            ]})
            : await getByApi(id);
    return pokemon;
};

const getByApi = async (id)=>{
    const pokemonInfo = (await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)).data
    const result = filter(pokemonInfo);
    return result;
}
const filter = (info)=>{
    const {stats, types, height, weight, sprites } = info;
    let stadistics = [];
    let Types = [];
    stats.forEach((obj) => {
        if (obj.stat.name == "hp") {
            stadistics.push(obj.base_stat);
        }
        if (obj.stat.name == "attack") {
            stadistics.push(obj.base_stat);
        }
        if (obj.stat.name == "defense") {
            stadistics.push(obj.base_stat);
        }
        if (obj.stat.name == "speed") {
            stadistics.push(obj.base_stat);
        }
    });
    types.forEach((obj) => {
        const aux = {
            name:obj.type.name
        };
        Types.push(aux);
    })
    const [life, attack, defense, speed] = stadistics;
    const imgDetail = sprites.other.dream_world.front_default;
    return { 
        name:info.name, 
        life, 
        attack, 
        defense, 
        speed, 
        types:Types, 
        height, 
        weight, 
        image:imgDetail }
}
module.exports = getPokemonById; 