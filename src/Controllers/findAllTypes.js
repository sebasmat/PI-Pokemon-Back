const { Types } = require('../db.js');
const axios = require('axios');
const findAllTypes = async () => {

    const typesDB = await Types.findAll();
    if (typesDB.length>0) {
        return typesDB;
    } else {
        const types = (await axios.get(`https://pokeapi.co/api/v2/type`)).data.results;
        types.forEach((obj) => {
            delete obj.url;
        });
        const typesBD = await Types.bulkCreate(types);
        return typesBD;
    }
}

module.exports = findAllTypes;