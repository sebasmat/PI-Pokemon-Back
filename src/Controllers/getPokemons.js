const { Pokemon, Types } = require('../db.js');
const { Op } = require("sequelize");
const axios = require('axios');
const getPokemons = async (name) => {
    const result = name ? await getByName(name) : await getAllUsers();
    return result;
}

const getByName = async (name) => {

    const result = await Pokemon.findOne(
        {
            where: {
                name: {
                    [Op.iLike]: name,
                },
            },
            include: [
                {
                    model: Types,
                    as: "types",
                    attributes: ['name'],

                    through: {
                        attributes: []
                    }
                }
            ]
        },

    );
    if (result) {
        return result;
    } else {
        const pokemon = await getNameAPI(name.toLowerCase());
        return pokemon;
    }
}

const getAllUsers = async () => {
    const usersDB = await Pokemon.findAll(
        {
            attributes: ['id', 'name', 'image', 'created', 'attack'],
            include: [
                {
                    model: Types,
                    as: "types",
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

    const usersAPI = (await axios.get('https://pokeapi.co/api/v2/pokemon')).data;
    const othersAPI = (await axios.get(usersAPI.next)).data.results;
    const result = await filter(usersAPI.results);
    const otherResults = await filter(othersAPI);
    const results = [...result, ...otherResults];
    return [...results, ...usersDB];
}

const getNameAPI = async (name) => {
    const pokemon = (await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)).data
    const result = filterName(pokemon);
    return result;
}

const filter = async (users) => {
    let promises = [];
    let pokemon = [];
    users.forEach((obj) => {
        let query = fetch(obj.url)
            .then(response => response.json())
            .then((data) => data);
        promises.push(query);
    });
    await Promise.all(promises)
        .then((allData) => {
            allData.forEach((data) => {
                const { name, types, sprites, id, stats } = data;
                let Types = [];
                let stadistics = [];
                stats.forEach((obj) => {
                    if (obj.stat.name == "attack") {
                        stadistics.push(obj.base_stat);
                    }
                });
                types.forEach((obj) => {

                    const aux = {
                        name: obj.type.name
                    };
                    Types.push(aux);
                })
                const [attack] = stadistics;
                pokemon.push({
                    id: id,
                    name: name,
                    types: Types,
                    image: sprites.front_default,
                    created: "false",
                    attack,
                    next: users.next
                });
            });
        })
    return pokemon;
}

const filterName = (info) => {
    const { stats, types, height, weight, sprites } = info;
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
            name: obj.type.name
        };
        Types.push(aux);
    })
    const [life, attack, defense, speed] = stadistics;
    const imgDetail = sprites.front_default;
    return {
        id: info.id,
        name: info.name,
        life,
        attack,
        defense,
        speed,
        types: Types,
        height,
        weight,
        image: imgDetail,
        created: false
    }
}
module.exports = getPokemons;