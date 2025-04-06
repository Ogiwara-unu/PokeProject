const axios = require("axios");

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Obtener un Pokémon por nombre o ID
const getPokemon = async (req, res) => {
    try {
        const { name } = req.params; // Captura el nombre o ID del Pokémon desde la URL
        const response = await axios.get(`${BASE_URL}/${name.toLowerCase()}`);

        const pokemonData = {
            id: response.data.id,
            name: response.data.name,
            height: response.data.height,
            weight: response.data.weight,
            types: response.data.types.map(t => t.type.name),
            sprite: response.data.sprites.front_default,
            abilities: response.data.abilities.map(a => a.ability.name),
            stats: response.data.stats.map(stat => ({
                name: stat.stat.name,
                base: stat.base_stat
            }))
        };

        res.json(pokemonData);
    } catch (error) {
        res.status(404).json({ error: "Pokémon no encontrado" });
    }
};

// Obtener una lista de Pokémon con paginación
const getPokemonList = async (req, res) => {
    try {
        let { limit, offset } = req.query;
        limit = limit ? parseInt(limit) : 10;
        offset = offset ? parseInt(offset) : 0;

        const response = await axios.get(`${BASE_URL}?limit=${limit}&offset=${offset}`);

        const pokemonList = response.data.results.map((p, index) => ({
            id: offset + index + 1,
            name: p.name,
            url: p.url
        }));

        res.json({ count: response.data.count, pokemon: pokemonList });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la lista de Pokémon" });
    }
};

// Obtener las habilidades de un Pokémon
const getPokemonAbilities = async (req, res) => {
    try {
        const { name } = req.params;
        const response = await axios.get(`${BASE_URL}/${name.toLowerCase()}`);

        const abilities = response.data.abilities.map(a => a.ability.name);

        res.json({ name: response.data.name, abilities });
    } catch (error) {
        res.status(404).json({ error: "Pokémon no encontrado" });
    }
};

module.exports = { getPokemon, getPokemonList, getPokemonAbilities };
