var express = require('express');

var router = express.Router();

var Pokemon = require('../model/pokemon.js');

var Move = require('../model/moveList.js');

router.get('/', function(request, response) {
    if (request.session.user) {

        Pokemon.find({}).sort('pId').exec(function(error, result) {
            if (error) {
                var errorMessage = 'Unable to save the pokedex entry to the page.';
                console.error('***ERROR: ', errorMessage);
            } else {
                if (request.sendJson) {
                    response.json({
                        result
                    });
                } else {
                    console.log('***RESULT: ', result);
                    response.render('pokemon/list', {
                        data: {
                            pokemonList: result
                        }
                    });
                    // console.log('******TEST: ', result);
                }
            }
        });
    } else {
        response.redirect('/user/login');
    }
});

// router.get('/test', function(request, response) {
//     var httpRequest = require('request');
//
//     httpRequest.get(
//         // Set the configuration data for sending the request.
//         {
//             url:'http://pokeapi.co/api/v2/pokemon/1',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         },
//
//         // Callback to handle the response of the call.
//         function (error, httpResponse) {
//             if (error) {
//                 console.log ('Error: ', error);
//                 response.send('There was a probelm');
//             }
//             else {
//                 var data = JSON.parse(httpResponse.body);
//
//                 for (i = 0; i < 4; i++){
//                     console.log('Move list: ' + data.moves[i].move.name);
//                 }
//                 // console.log ('http response: ', data.moves[0].move.name);
//                 response.send('request was made');
//             }
//         }
//     )
// })

router.get('/create', function(request, response) {
    if (request.session.user && request.session.user.admin == true) {
        var list = [{
                value: 'Bug'
            },
            {
                value: 'Dark'
            },
            {
                value: 'Dragon'
            },
            {
                value: 'Electric'
            },
            {
                value: 'Fairy'
            },
            {
                value: 'Fighting'
            },
            {
                value: 'Fire'
            },
            {
                value: 'Flying'
            },
            {
                value: 'Ghost'
            },
            {
                value: 'Grass'
            },
            {
                value: 'Ground'
            },
            {
                value: 'Ice'
            },
            {
                value: 'Normal'
            },
            {
                value: 'Poison'
            },
            {
                value: 'Psychic'
            },
            {
                value: 'Rock'
            },
            {
                value: 'Steel'
            },
            {
                value: 'Water'
            }
        ];

        var key, item;
        for (key in list) {
            // Grab the item in the list.
            item = list[key];
            item.class = item.value.toLowerCase();
        }
        response.render('pokemon/edit', {
            data: {
                title: 'Add Pokedex Entry',
                method: 'POST',
                typeList: list
            }
        });
    }
});

// route to save new pokemon to database
router.post('/', function(request, response) {
    console.log('Data received: ', request.body);

    var httpRequest = require('request');

    httpRequest.get({
            url: 'http://pokeapi.co/api/v2/pokemon/' + request.body.pId,
            headers: {
                'Content-Type': 'application/json'
            }
        },

        function(error, pokemonData) {
            if (error) {
                console.log('ERROR: ', error);
                response.send('There was a problem getting the API data.');
            } else {
                var data = JSON.parse(pokemonData.body);

                var moveList = [];
                var move;
                for (i = 0; i < 4; i++) {
                    move = {
                        name: data.moves[i].move.name
                    }

                    moveList.push(move);

                    console.log('Move List: ', moveList[i].name);
                }


                Move.insertMany(moveList, function(error, savedMoves) {
                    if (error) {
                        console.log('There was an error adding the move list to the database.');
                        response.send('There was an error adding the move list.');
                    } else {
                        var newPokemon = Pokemon(request.body);
                        newPokemon.moves = savedMoves;

                        newPokemon.save(function(error, result) {
                            if (error) {
                                var errorMessage = 'Unable to save the pokedex entry to the database.'
                                console.error('***ERROR: ', errorMessage);
                                console.error(error);
                                response.send(errorMessage);
                            } else {
                                if (request.sendJson) {
                                    response.json({
                                        message: 'New pokedex entry was saved.'
                                    });
                                } else {

                                    // Add a flash message for successful creation
                                    request.flash('success', 'Pokedex entry was added.');

                                    // Redirect back to the Pokemon add page.
                                    response.redirect('/pokemon');
                                }
                            }
                        })
                    }
                })
            }
        }
    )
});

// Route to search for pokemon by name
router.get('/search', function(request, response) {
    var pokemonName = request.query.name;
    console.log('***HERE***', request.query);

    Pokemon.findOne({
        name: pokemonName
    }, function(error, result) {
        if (error) {
            var errorMessage = 'Unable to find pokemon by name ' + pokemonName;
            console.error('***ERROR: ' + errorMessage);
            response.send(errorMessage);
            return;
        }

        if (result == null) {
            response.send('Pokemon not found. ' + pokemonName);
            return;
        } else {
            if (request.sendJson) {
                response.json(result)
            } else {
                response.redirect('/pokemon/' + result.id);
            }
        }
    })
})


// Route to grab a specific pokemon by its Id
router.get('/:id', function(request, response) {
    var pokemonId = request.params.id;

    Pokemon
        .findById(pokemonId)
        .populate('moves')
        .exec(function(error, result) {
            if (error) {
                var errorMessage = 'Unable to find pokedex entry by id: ' + pokemonId;
                console.error('***ERROR: ', errorMessage);
                response.send(errorMessage);
            } else {
                if (request.sendJson) {
                    response.json(result)
                } else {
                    response.render('pokemon/view', {
                        data: {
                            pokemon: result
                        }
                    });
                }
            }
        });
    // Pokemon.findById (pokemonId, function(error, result) {
    //     if (error) {
    //         var errorMessage = 'Unable to find pokedex entry by id: ' + pokemonId;
    //         console.error('***ERROR: ', errorMessage);
    //         response.send(errorMessage);
    //     }
    //     else {
    //         response.render('pokemon/view', {
    //             data: {
    //                 pokemon: result
    //             }
    //         });
    //     }
    // });
});

// Route to show the pokedex edit form
router.get('/:id/edit', function(request, response) {
    var pokemonId = request.params.id;

    Pokemon.findById(pokemonId, function(error, result) {
        if (error) {
            var errorMessage = 'Unable to find pokedex entry by id: ' + pokemonId;
            console.error('***ERROR: ', errorMessage);
            response.send(errorMessage);
        } else {
            var list = [{
                    value: 'Bug'
                },
                {
                    value: 'Dark'
                },
                {
                    value: 'Dragon'
                },
                {
                    value: 'Electric'
                },
                {
                    value: 'Fairy'
                },
                {
                    value: 'Fighting'
                },
                {
                    value: 'Fire'
                },
                {
                    value: 'Flying'
                },
                {
                    value: 'Ghost'
                },
                {
                    value: 'Grass'
                },
                {
                    value: 'Ground'
                },
                {
                    value: 'Ice'
                },
                {
                    value: 'Normal'
                },
                {
                    value: 'Poison'
                },
                {
                    value: 'Psychic'
                },
                {
                    value: 'Rock'
                },
                {
                    value: 'Steel'
                },
                {
                    value: 'Water'
                }
            ]

            // Iterrate through each item in the
            // type list.
            var key, item;
            for (key in list) {
                // Grab the item in the list.
                item = list[key];

                // Check if the pokemon returned has a type
                // value equal to the value of the type in the list.
                // console.log (item);
                if (result.type.toLowerCase() == item.value.toLowerCase()) {
                    // Set that the type is selected.
                    item.selected = 'selected';
                }

                item.class = item.value.toLowerCase();
            }

            response.render('pokemon/edit', {
                data: {
                    title: 'Edit Pokedex Entry',
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

    // var httpRequest = require('request');
    //
    // httpRequest.get(
    //     {
    //         url:'http://pokeapi.co/api/v2/pokemon/' + pokemonId,
    //         headers: {
    //             'Content-Type' : 'application/json'
    //         }
    //     },
    //
    //     function(error, pokemonData) {
    //         if (error) {
    //             console.log('ERROR: ', error);
    //             response.send('There was a problem getting the API data for moveset.');
    //         }
    //         else {
    //             var data = JSON.parse(pokemonData.body);
    //
    //             var moveList = [];
    //             var move;
    //             for(i = 0; i < 4; i++) {
    //                 move = {
    //                     name: data.moves[i].move.name
    //                 }
    //
    //                 moveList.push(move);
    //
    //                 console.log('Move List: ', moveList[i].name);
    //             }
    //         }
    //     }
    // )
    Pokemon.findByIdAndUpdate(pokemonId, request.body,
        function(error, result) {
            if (error) {
                console.error('***ERROR: Unable to update pokedex entry.', error);
            } else {
                if (request.sendJson) {
                    response.json({
                        message: "Pokedex Entry was updated."
                    });
                } else {
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
        } else {
            if (request.sendJson) {
                response.json({
                    message: "Pokedex Entry was deleted."
                });
            } else {
                response.redirect('/pokemon/');
            }
        }
    });
});

module.exports = router;
