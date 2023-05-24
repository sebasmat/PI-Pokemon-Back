const {Pokemon} = require('../db.js');
const createPokemon = async (pokemon, {type1,type2})=>{
    const newPokemon = await Pokemon.create(pokemon);
    await newPokemon.addTypes(type1);
    await newPokemon.addTypes(type2);
    return newPokemon;
}
module.exports = createPokemon;