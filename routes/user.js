var express = require('express');

var router = express.Router();

var User = require('../model/user.js');

router.get('/login', function(request, response) {
    if (request.session.user) {
        response.redirect('/search');
    }
    else {
        response.render('login');
    }
});

// router.post('/login', function(request, response) {
//     User.findOne(
//         {
//             username: request.body.username,
//             password: request.body.password
//         },
//         {},
//         function(error, result) {
//             if (error) {
//                 console.error('*** ERROR: Problem finding the user.');
//                 console.error(error);
//                 response.send('There was an error with the page.');
//             }
//             else if (!result) {
//                 request.flash('error', 'Your username or password is not correct');
//                 response.redirect('/user/login');
//
//                 console.log('***Test: ', request);
//             }
//             else {
//                 console.log('This is the found user: ', result);
//
//                 request.session.user = {
//                     username: result.username,
//                     email: result.email
//                 }
//                 console.log('This is the session data: ', request.session);
//
//                 response.redirect ('/search');
//             }
//         }
//     );
// });
//
router.get('/register', function(request, response) {
    response.render ('register');
});

module.exports = router;
