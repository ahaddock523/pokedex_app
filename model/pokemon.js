var mongoose = require('mongoose');

// Grab schema object from mongoose
var Schema = mongoose.Schema;

// model Schema
var pokemonSchema = new Schema ({
    pId: Number,
    name: String,
    type: String,
    species: String,
    height: String,
    weight: String,
    ability: String,
    health: Number,
    attack: Number,
    defense: Number,
    spAttack: Number,
    spDefense: Number,
    speed: Number,
    generation: String
});

// Create model object
var Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;
