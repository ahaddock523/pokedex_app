var express = require('express');

var router = express.Router();

router.get('/', function(request, response) {
    response.render('home');
});

router.get('/about', function(request, response) {
    response.render('about');
});

router.get('/search', function(request, response) {
    response.render('search');
});

router.get('/user', function(request, response) {
    response.render('home', {
        layout: 'index-angular'
    });
});

module.exports = router;
