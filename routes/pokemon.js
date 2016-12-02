var express = require('express');

var router = express.Router();

var Pokemon = require('../model/pokemon.js');

router.get('/', function(request, response) {

    Pokemon.find({}).sort('pId').exec(function(error, result) {
        if(error) {
            var errorMessage = 'Unable to save the pokedex entry to the page.';
            console.error('***ERROR: ', errorMessage);
        }
        else {
            if (request.sendJson) {
                response.json({ result });
            }
            else {
                console.log('***RESULT: ', result);
                response.render('pokemon/list', {
                    data: {
                        pokemonList: result
                    }
                });
            }
        }
    });
});

router.get('/create', function(request, response) {
    response.render('pokemon/edit', {
        data: {
            title: 'Add Pokedex Entry',
            method: 'POST'
        }
    });
});

// route to save new pokemon to database
router.post('/', function(request, response) {
    console.log('Data received: ', request.body);

    var newPokemon = Pokemon(request.body);

        newPokemon.save (function(error) {
            if (error) {
                var errorMessage = 'Unable to save the pokedex entry to the database.'
                console.error('***ERROR: ', errorMessage);
                console.error(error);
                response.send(errorMessage);
            }
            else {
                if (request.sendJson) {
                    response.json({
                        message: 'New pokedex entry was saved.'
                    });
                }
                else {
                    // Add a flash message for successful creation
                    request.flash('success', 'Pokedex entry was added.');

                    // Redirect back to the Pokemon add page.
                    response.redirect('/pokemon');
                }
            }
        })
});

// Route to grab a specific pokemon by its Id
router.get('/:id', function(request, response) {
    var pokemonId = request.params.id;

    Pokemon.findById (pokemonId, function(error, result) {
        if (error) {
            var errorMessage = 'Unable to find pokedex entry by id: ' + pokemonId;
            console.error('***ERROR: ', errorMessage);
            response.send(errorMessage);
        }
        else {
            response.render('pokemon/view', {
                data: {
                    pokemon: result
                }
            });
        }
    });
});

// Route to show the pokedex edit form
router.get('/:id/edit', function(request, response) {
    var pokemonId = request.params.id;

    Pokemon.findById (pokemonId, function(error, result) {
        if (error) {
            var errorMessage = 'Unable to find pokedex entry by id: ' + pokemonId;
            console.error('***ERROR: ', errorMessage);
            response.send(errorMessage);
        }
        else {
            var list = [
                { value: 'Bug'},
                { value: 'Dark'},
                { value: 'Dragon'},
                { value: 'Electric'},
                { value: 'Fairy'},
                { value: 'Fighting'},
                { value: 'Fire'},
                { value: 'Flying'},
                { value: 'Ghost'},
                { value: 'Grass'},
                { value: 'Ground'},
                { value: 'Ice'},
                { value: 'Normal'},
                { value: 'Poison'},
                { value: 'Psychic'},
                { value: 'Rock'},
                { value: 'Steel'},
                { value: 'Water'}
            ]

            // Iterrate through each item in the
            // type list.
            var key, item;
            for (key in list) {
                // Grab the item in the list.
                item = list [key];

                // Check if the pokemon returned has a type
                // value equal to the value of the type in the list.
                console.log (item);
                if (result.type.toLowerCase () == item.value.toLowerCase ()) {
                    // Set that the type is selected.
                    item.selected = 'selected';
                }

                item.class = item.value.toLowerCase ();
            }

            response.render('pokemon/edit', {
                data: {
                    title:'Edit Pokedex Entry',
                    method: 'PUT',
                    pokemon: result,
                    typeList: list
                }
            });
        }
    });
});

// Route to handle updating an existing pokedex entry
router.put('/:id', function(request, response) {
    var pokemonId = request.params.id;

    Pokemon.findByIdAndUpdate (pokemonId, request.body,
        function(error, result) {
        if (error) {
            console.error('***ERROR: Unable to update pokedex entry.', error);
        }
        else {
            if(request.sendJson) {
                response.json({
                    message:"Pokedex Entry was updated."
                });
            }
            else {
                response.redirect('/pokemon/' + pokemonId);
            }
        }
    });
});

router.get('/:id/delete', function(request, response) {
    var pokemonId = request.params.id;

    Pokemon.findByIdAndRemove(pokemonId, function(error, result) {
        if (error) {
            console.error('***ERROR: Unable to delete pokedex entry by id.', error);
            response.send('***ERROR: Unable to delete pokedex entry by id.', pokemonId);
        }
        else {
            if(request.sendJson) {
                response.json({
                    message:"Pokedex Entry was deleted."
                });
            }
            else {
                response.redirect('/pokemon/');
            }
        }
    });
});

module.exports = router;
